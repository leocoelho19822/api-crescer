const nodemailer = require("nodemailer");

/*
const transporter = nodemailer.createTransport({
    host: "smtpi.uni5.net",
    port: 587,
    secure: false, // Use `true` se o serviço exigir TLS
    auth: {
        user: "lcoelho@perfilsolucao.com.br",
        pass: process.env.PASS_NODEMAILER ,
    },
});
*/


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "suporte.craveirocoelho@gmail.com",
        pass: process.env.PASS_GMAIL,
    },
});

async function sendResetPasswordEmail(email, token) {
  const resetLink = `https://crescer.vercel.app/reset-password/${token}`;

  const mailOptions = {
    from: "suporte.craveirocoelho@gmail.com",
    to: email,
    subject: "Redefinição de Senha",
    html: `<p>Olá,</p>
           <p>Para redefinir sua senha, clique no link abaixo:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>Se você não solicitou essa mudança, ignore este email.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

async function sendVerificationEmail(email, token) {
    const verificationLink = `https://crescer.vercel.app/verify-email/${token}`;

    const mailOptions = {
        from: "suporte.craveirocoelho@gmail.com",
        to: email,
        subject: "Verificação de E-mail",
        html: `
            <p>Olá,</p>
            <p>Clique no link abaixo para verificar seu e-mail:</p>
            <a href="${verificationLink}">${verificationLink}</a>
            <p>Se você não se cadastrou, ignore este e-mail.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
}


module.exports = { sendResetPasswordEmail, sendVerificationEmail };
