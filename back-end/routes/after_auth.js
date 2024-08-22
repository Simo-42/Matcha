const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db.js');  // Importez la connexion depuis db.js
const jwt = require('jsonwebtoken'); // Pour generer le token JWT
const authenticateToken = require('../middleware/authMiddleware.js');

require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env
const router = express.Router();

const userQueries = require('../queries/index.js'); // importe index.js depuis le dossier queries

const { send_email } = require('../utils/send_mail.js');

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
		const user = await userQueries.update_user_spec(userId, info);
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

router.post('/profil/update_profil', authenticateToken, async (req, res) => {
    const { email, username, firstname, lastname } = req.body;
    const userId = req.user.id;


    const info = {
        email: email,
        username: username,
        firstname: firstname,
        lastname: lastname,
    };


    try {
        if (await userQueries.check_mail_user_exist(email) == true) { // Vérifiez si l'e-mail existe déjà
            const existingEmailUser = await getUserByEmail(email);
            if (existingEmailUser && existingEmailUser.id !== userId) 
			{
                return res.status(400).json({ error: 'Email already taken' });
            }
        }
        // Vérification du nom d'utilisateur
        if (await userQueries.check_username_user_exist(username)) {
            const existingUsernameUser = await userQueries.getUserByUsername(username);
            if (existingUsernameUser && existingUsernameUser.id !== userId) { // Vérifiez si l'utilisateur existe déjà et s'il n'est pas l'utilisateur actuel
                return res.status(400).json({ error: 'Username already taken' });
            }
        }
		const user_profil = await userQueries.get_profil_personal_by_id(userId)
		const email_check = user_profil.email;
		if (email !== email_check.email) // Si l'e-mail a été modifié renvoyer un mail de vérification
		{
			console.log("email changed");
			await userQueries.update_verification_status(userId);
			await userQueries.send_email(email, userId);
			const user = await userQueries.update_user_info(userId, info);
			if (!user) 
				return res.status(500).json({ error: 'Error updating user information' });
			return res.status(200).json({ message: 'Don\'t forget to verify your mail again. Mail has been sent to you', user });
		}
		
        const user = await userQueries.update_user_info(userId, info);
        if (!user) {
            return res.status(500).json({ error: 'Error updating user information' });
        }
        return res.status(200).json({ message: 'User spec updated successfully', user });
    } catch (error) {
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
		const user = await userQueries.insert_new_pictures(userId, pictures);
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

router.get('/profil/spec_info', authenticateToken, async (req, res) => {
	const userId = req.user.id;  // Utilisation de `req.user` pour accéder à l'ID utilisateur
	console.log('User ID:', userId); 
  
	try {
		const result = await userQueries.get_profil_spec_by_id(userId);
		if (!result) {
			return res.status(404).json({ error: 'User not found' });
		}
		return res.status(200).json({ message: 'User information fetched successfully', result });
	} catch (error) {
		console.log('Error fetching user:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

router.post('/profil/location', authenticateToken, async (req, res) => {
	const { latitude, longitude } = req.body;
	const userId = req.user.id;  // Utilisez `req.user` pour accéder aux informations de l'utilisateur
	console.log('Received pictures:', req.body.pictures); // Ajoutez ceci pour déboguer
	console.log('User ID:', req.user.id); // Assurez-vous que le middleware `authenticateToken` fonctionne correctement
  
	try 
	{
		const user = await userQueries.insert_location(userId, latitude, longitude);
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

router.get('/profil/id_info', authenticateToken, async (req, res) => {
	const userId = req.user.id;  // Utilisation de `req.user` pour accéder à l'ID utilisateur
	console.log('User ID:', userId); 
  
	try {
		const result = await userQueries.get_profil_personal_by_id(userId);
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