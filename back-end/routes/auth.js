const express = require('express');
const bcrypt = require('bcryptjs');

require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env
const router = express.Router();
const { check_mail_user_exist, createUser } = require('../queries/UserQueries.js');
const { send_email } = require('../utils/send_mail.js');

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  // Hachage du mot de passe
  const hashed_password = await bcrypt.hash(password, 10);
  const info = {
    email: email,
    password: hashed_password
  };
  
  try {
    // Vérifier si cet email est déjà enregistré dans la DB
    const existingUser = await check_mail_user_exist(email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }
    const user = await createUser(info);
    if (!user) {
        return res.status(500).json({ error: 'Error creating user' });
    }

    // await send_email(email, user.id);
    
    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
  
  
    } catch (error) {
    console.log('Error checking existing user:', error); // Affiche une erreur si la vérification de l'utilisateur existant échoue
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// router.get('/verify/:id', async (req, res) => {
//   const userId = req.params.id;
  
//   try {
//     await prisma.user.update({
//       where: { id: parseInt(userId) },
//       data: { verified: true },
//     });
//     res.send('Email verified successfully!');
//   } catch (error) {
//     console.log('Error verifying email:', error); // Affiche une erreur si la vérification de l'email échoue
//     res.status(400).send('Email verification failed');
//   }
// });


module.exports = router;