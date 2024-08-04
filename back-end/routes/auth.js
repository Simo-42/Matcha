const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env

const prisma = new PrismaClient();
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Hachage du mot de passe
  const hashed_password = await bcrypt.hash(password, 10);

  // Vérifier si cet email est déjà enregistré dans la DB
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const info = {
      email: email,
      password: hashed_password
    };

    try {
      // Création de l'utilisateur dans la DB 
      const user = await prisma.user.create({
        data: info,
      });

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.MAIL_VERIF, // Utilise la variable d'environnement pour l'adresse email
          pass: process.env.MAIL_MDP, // Utilise la variable d'environnement pour le mot de passe
        },
      });

      const mailOptions = {
        from: process.env.MAIL_VERIF,  // Adresse email de l'expéditeur
        to: email,                     // Adresse email du destinataire (utilisateur)
        subject: 'Account Verification',
        text: `Please verify your account by clicking the link: http://localhost:3000/api/auth/verify/${user.id}`,
      };

      // Envoi de l'e-mail de vérification
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error); // Affiche une erreur si l'envoi de l'e-mail échoue
          return res.status(500).json({ error: 'Failed to send verification email' });
        }
        console.log('Email sent: ' + info.response); // Affiche une confirmation si l'e-mail est envoyé avec succès
      });

      res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (error) {
      console.log('Error creating user:', error); // Affiche une erreur si la création de l'utilisateur échoue
      return res.status(400).json({ error: 'Error occurred during your registration' });
    }
  } catch (error) {
    console.log('Error checking existing user:', error); // Affiche une erreur si la vérification de l'utilisateur existant échoue
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/verify/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { verified: true },
    });
    res.send('Email verified successfully!');
  } catch (error) {
    console.log('Error verifying email:', error); // Affiche une erreur si la vérification de l'email échoue
    res.status(400).send('Email verification failed');
  }
});

module.exports = router;
