// Importation des différents modules
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db.js');  // Importez la connexion depuis db.js
const { check_mail_user_exist, createUser, check_username_user_exist, check_same_password } = require('../queries/UserQueries.js');
const { sendResetEmail } = require('../utils/send_mail.js');
const { generateResetToken } = require('../utils/send_password_reset.js');

require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env
const router = express.Router();

router.post('/forgot_password', async (req, res) => {
  const { email, username } = req.body;
  
  try {
    // Vérifier si cet email est déjà enregistré dans la DB


    const reset_token = await generateResetToken(email);
    await sendResetEmail(email, reset_token);
    
    res.status(201).json({ message: 'Reset password email has been sent to you! Check your spam' });
  
  } catch (error) {
    console.log('Error checking existing user:', error); // Affiche une erreur si la vérification de l'utilisateur existant échoue
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset/:token', async (req, res) => { // Ajout du slash manquant
  console.log('POST /reset/:token called'); 
  const { token } = req.params;
  const { newPassword } = req.body;

  try {

    const queryForUsername = `
    SELECT username FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()
  `;
  const usernameResult = await pool.query(queryForUsername, [token]);

  if (usernameResult.rows.length === 0) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  const username = usernameResult.rows[0].username;

    if (await check_same_password(username, newPassword) == true) {
      return res.status(400).json({ error: 'Same password as before.' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = `
      UPDATE users
      SET password = $1, reset_token = NULL, reset_token_expires = NULL
      WHERE reset_token = $2 AND reset_token_expires > NOW()
      RETURNING *`;

    const values = [hashedPassword, token];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.log('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/verify_password/:token', async (req, res) => { // Ajout du slash manquant
  console.log("s'execute bien ! ");
  console.log("s'execute bien ! ");
  console.log("s'execute bien ! ");
	
  const { token } = req.params;
  console.log('GET /verify/:token called'); 

  try {
    const query = `
      SELECT * FROM users
      WHERE reset_token = $1 AND reset_token_expires > NOW()`;

    const values = [token];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    res.redirect(`http://localhost:3001/verify_password/${token}`);
    

  } catch (error) {
    console.log('Error verifying token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
