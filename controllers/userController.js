const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetPasswordEmail, sendVerificationEmail } = require("../services/emailService");

// Função para registrar um novo usuário
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "E-mail já cadastrado" });
        }

        //const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha
        const user = await User.create({ name, email, password, phone, isVerified: false });

        // Gera token de verificação
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Envia e-mail de verificação
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: "Utilizador criado com sucesso! Verifique seu e-mail." });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor", error });
    }
};

// Função de login e geração do cookie JWT
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Utilizador não encontrado" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "E-mail não verificado. Verifique seu e-mail antes de fazer login." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Senha incorreta" });
        }

        // Gera token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        // Define o cookie HTTPOnly
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        });
        res.setHeader("Access-Control-Allow-Credentials", "true"); // Permite o envio de cookies no frontend
        

        res.json({ message: "Login bem-sucedido", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor", error });
    }
};

// Função para obter os dados do usuário autenticado
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
        if (!user) {
            return res.status(404).json({ message: "Utilizador não encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor", error });
    }
};

// Função para fazer logout e remover o cookie JWT
exports.logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    return res.status(200).json({ message: "Logout realizado com sucesso!" });
};

// Função para envio de e-mail de redefinição de senha
exports.sendResetEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "E-mail é obrigatório" });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "E-mail não encontrado na base de dados." });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        await sendResetPasswordEmail(email, token);

        res.status(200).json({ message: "Se este e-mail estiver cadastrado, enviaremos um link de redefinição." });
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        res.status(500).json({ message: "Erro ao enviar e-mail", error: error.message });
    }
};

// Função para redefinir a senha do usuário
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: "Token e senha são obrigatórios" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Senha redefinida com sucesso!" });
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(400).json({ message: "Token inválido ou expirado" });
    }
};

// Função para verificar o e-mail após o registro
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "E-mail verificado com sucesso! Agora pode fazer login." });
    } catch (error) {
        res.status(400).json({ message: "Token inválido ou expirado" });
    }
};
