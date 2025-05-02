const transporter = require("../config/email");

const sendConfirmationEmail = async (email, token) => {
    const confirmLink = `${process.env.FRONTEND_URL}/confirmar/${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirma tu Registro",
        html: `
            <h2>Hola, confirma tu registro</h2>
            <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente botón:</p>
            <a href="${confirmLink}" style="
                background-color: #4CAF50;
                color: white;
                padding: 10px 15px;
                text-decoration: none;
                display: inline-block;
                margin-top: 10px;
                border-radius: 5px;
            ">Confirmar Registro</a>
            <p>Si no solicitaste este correo, ignóralo.</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Recuperación de Contraseña",
        html: `
            <h2>Recuperación de Contraseña</h2>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetLink}" style="background-color:#4CAF50; color:white; padding:10px 15px; text-decoration:none; border-radius:5px;">
                Restablecer Contraseña
            </a>
            <p>Este enlace expira en 1 hora.</p>`
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail, sendPasswordResetEmail };