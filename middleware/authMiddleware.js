const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    //console.log("Cookies recebidos:", req.cookies); // Verifica se o token está nos cookies

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Acesso negado, token ausente ou inválido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
};