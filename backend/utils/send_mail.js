const nodemailer = require("nodemailer");
require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env

const send_email = async (email, user_id) => {
  console.log(process.env.MAIL_VERIF);
  console.log(process.env.MAIL_MDP);
  console.log("im here");
  console.log("email ===", email);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_VERIF,
      pass: process.env.MAIL_MDP,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_VERIF, // Adresse email de l'expéditeur
    to: email, // Adresse email du destinataire (utilisateur)
    subject: "Account Verification",
    text: `Please verify your account by clicking the link: http://localhost:3005/api/auth/verify/${user_id}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error); // Affiche une erreur si l'envoi de l'e-mail échoue
        return reject(new Error("Failed to send verification email")); // Fonction predefeni qui renvoie les err d'une promesse qui a echoue
      }
      console.log("Email sent: " + info.response); // Affiche une confirmation si l'e-mail est envoyé avec succès
      resolve(info);
    });
  });
};

const sendResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_VERIF,
      pass: process.env.MAIL_MDP,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  const resetUrl = `http://localhost:3000/verify_password/${resetToken}`;
  const mailOptions = {
    from: process.env.MAIL_VERIF,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return reject(new Error("Failed to send reset email"));
      }
      console.log("Email sent: " + info.response);
      resolve(info);
    });
  });
};

module.exports = { send_email, sendResetEmail };
