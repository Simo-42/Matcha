const nodemailer = require('nodemailer');

const send_email = async (email, user_id) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_VERIF, // Utilise la variable d'environnement pour l'adresse email
            pass: process.env.MAIL_MDP,   // Utilise la variable d'environnement pour le mot de passe
        },
    });

    const mailOptions = {
        from: process.env.MAIL_VERIF,   // Adresse email de l'expéditeur
        to: email,                      // Adresse email du destinataire (utilisateur)
        subject: 'Account Verification',
        text: `Please verify your account by clicking the link: http://localhost:3000/api/auth/verify/${user_id}`,
    };

    return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error); // Affiche une erreur si l'envoi de l'e-mail échoue
                return reject(new Error('Failed to send verification email')); // Fonction predefeni qui renvoie les err d'une promesse qui a echoue
            }
            console.log('Email sent: ' + info.response); // Affiche une confirmation si l'e-mail est envoyé avec succès
            resolve(info);
        });
    });
};

module.exports = { send_email };
