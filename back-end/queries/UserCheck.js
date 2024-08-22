const pool = require('../db.js');  // Importez la connexion depuis db.js
const bcrypt = require('bcryptjs');


const check_mail_user_exist = async (email) => {
	try {
		const query = 'SELECT * FROM users WHERE email = $1';
		const values = [email];

		const res = await pool.query(query, values);
		if (res.rows.length > 0) {
			console.log('User email exists:', res.rows[0]);
			return true;
		} else {
			console.log('User email does not exist, he can register');
			return false;
		}
	} catch (err) {
		console.error('Error executing query', err.stack);
		return false;
	}
};

const check_verif_user = async (verified) => {
	try {
		const query = 'SELECT * FROM users WHERE verified = $1';
		const values = [verified];

		const res = await pool.query(query, values);
		if (res.rows.length > 0) {
			console.log('User is verified', res.rows[0]);
			return true;
		} else {
			console.log('User is not verified, needs to be verified');
			return false;
		}
	} catch (err) {
		console.error('Error executing query', err.stack);
		return false;
	}
};

const check_username_user_exist = async (username) => {
	try {
		const query = 'SELECT * FROM users WHERE username = $1';
		const values = [username];

		const res = await pool.query(query, values);
		if (res.rows.length > 0) {
			console.log('User username exists:', res.rows[0]);
			return true; // User existe, ne peut pas s'inscrire
		} else {
			console.log('User username does not exist, he can register');
			return false; // User existe, peut s'inscrire
		}
	} catch (err) {
		console.error('Error executing query', err.stack);
		return false;
	}
};

const check_same_password = async (username, new_password) => {
	try {
		const query = 'SELECT password FROM users WHERE username = $1';
		const values = [username];

		// Exécute la requête pour récupérer le mot de passe actuel de l'utilisateur
		const res = await pool.query(query, values);

		if (res.rows.length > 0) {
			const existingPassword = res.rows[0].password;

			// Compare le mot de passe actuel avec le nouveau mot de passe
			const passwordMatch = await bcrypt.compare(new_password, existingPassword);

			if (passwordMatch) {
				console.log('The new password is the same as the current password.');
				return true; // Le nouveau mot de passe est identique à l'actuel
			} else {
				console.log('The new password is different from the current password.');
				return false; // Le nouveau mot de passe est différent de l'actuel
			}
		} else {
			console.log('User not found.');
			return false; // L'utilisateur n'a pas été trouvé
		}
	} catch (err) {
		console.error('Error executing query', err.stack);
		return false;
	}
};

module.exports = { check_mail_user_exist, check_username_user_exist, check_verif_user, check_same_password };

