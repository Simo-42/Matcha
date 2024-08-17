const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db.js');  // Importez la connexion depuis db.js
const jwt = require('jsonwebtoken'); // Pour generer le token JWT
const authenticateToken = require('../middleware/authMiddleware.js');

require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env
const router = express.Router();
const { update_user_spec, insert_new_pictures, get_profil_spec_by_id } = require('../queries/UserQueries.js');

router.post('/profil/update', authenticateToken, async (req, res) => {
	const { gender, sex_pref, biography, interests } = req.body;
	const userId = req.user.id;  // Utilisez `req.user` pour accéder aux informations de l'utilisateur
  
	console.log('User ID:', userId);
	console.log('POST /register after auth called');
  
	const info = {
	  gender: gender,
	  sexual_preference: sex_pref,
	  biography: biography,
	  interests: interests,
	};
	console.log('Info:', info);

	try 
	{
		const user = await update_user_spec(userId, info);
		if (!user) 
		{
			return res.status(500).json({ error: 'Error updating user information' });
	  	}
		console.log('User spec updated successfully:', user);
	  	return res.status(200).json({ message: 'User spec updated successfully', user });
	} 
	catch (error) 
	{
	  console.log('Error updating user:', error);
	  return res.status(500).json({ error: 'Internal server error' });
	}
});

router.post('/pictures', authenticateToken, async (req, res) => {
	const { pictures } = req.body;
	const userId = req.user.id;  // Utilisez `req.user` pour accéder aux informations de l'utilisateur
	console.log('Received pictures:', req.body.pictures); // Ajoutez ceci pour déboguer
	console.log('User ID:', req.user.id); // Assurez-vous que le middleware `authenticateToken` fonctionne correctement
  
	try 
	{
		const user = await insert_new_pictures(userId, pictures);
		if (!user) 
		{
			return res.status(500).json({ error: 'Error updating user information' });
	  	}
		console.log('User spec updated successfully:', user);
	  	return res.status(200).json({ message: 'User spec updated successfully', user });
	} 
	catch (error) 
	{
	  console.log('Error updating user:', error);
	  return res.status(500).json({ error: 'Internal server error' });
	}
});

router.get('/profil/info', authenticateToken, async (req, res) => {
	const userId = req.user.id;  // Utilisation de `req.user` pour accéder à l'ID utilisateur
	console.log('User ID:', userId); 
  
	try {
		const result = await get_profil_spec_by_id(userId);
		if (!result) {
			return res.status(404).json({ error: 'User not found' });
		}
		return res.status(200).json({ message: 'User information fetched successfully', result });
	} catch (error) {
		console.log('Error fetching user:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;