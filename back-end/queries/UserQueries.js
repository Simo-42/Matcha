const pool = require('../db.js');  // Importez la connexion depuis db.js
const bcrypt = require('bcryptjs');

// userQueries.js

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

const getUserByEmail = async (email) => {
    try {
        const query = 'SELECT id FROM users WHERE email = $1';
        const values = [email];

        const res = await pool.query(query, values);
        return res.rows[0];  // Retourne l'utilisateur si l'email existe
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

const getUserByUsername = async (username) => {
    try {
        const query = 'SELECT id FROM users WHERE username = $1';
        const values = [username];

        const res = await pool.query(query, values);
        return res.rows[0];  // Retourne l'utilisateur si le nom d'utilisateur existe
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
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

const createUser = async (userInfo) => {
	const { email, password, username, firstname, lastname } = userInfo;

	try {
		const query = `
			INSERT INTO users (email, password, username, firstname, lastname)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING *`;

		// Les valeurs à insérer dans la requête SQL
		const values = [email, password, username, firstname, lastname];

		// Exécution de la requête SQL
		const res = await pool.query(query, values);

		// Retourne l'utilisateur créé
		return res.rows[0];
	} catch (err) {
		console.error('Error executing query', err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
};

const update_user_spec = async (userId, userInfo) => {
	const { gender, sexual_preference, biography, interests } = userInfo;
	try {
		const query = `
			UPDATE users
			SET gender = $1,
					sexual_preference = $2,
					biography = $3,
					interests = $4,
					updated_at = CURRENT_TIMESTAMP
			WHERE id = $5
			RETURNING *`;

		const values = [gender, sexual_preference, biography, JSON.stringify(interests), userId];
		// Note: JSON.stringify est utilisé pour s'assurer que 'interests' est stocké correctement en tant que JSON

		const res = await pool.query(query, values);
		console.log('Updated user:', res.rows[0]);
		return res.rows[0]; // Retourne l'utilisateur mis à jour

	} catch (err) {
		console.error('Error executing query', err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
};

const update_user_info = async (userId, userInfo) => {
	const { email, username, firstname, lastname } = userInfo;
	try {
		const query = `
			UPDATE users
			SET email = $1,
					username = $2,
					firstname = $3,
					lastname = $4,
					updated_at = CURRENT_TIMESTAMP
			WHERE id = $5
			RETURNING *`;

		const values = [email, username, firstname, lastname, userId];
		// Note: JSON.stringify est utilisé pour s'assurer que 'interests' est stocké correctement en tant que JSON

		const res = await pool.query(query, values);
		console.log('Updated user:', res.rows[0]);
		return res.rows[0]; // Retourne l'utilisateur mis à jour

	} catch (err) {
		console.error('Error executing query', err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
};
const insert_new_pictures = async (userId, photos) => {
	try {
		const query = `
			UPDATE users
			SET 
				photos = $1,  
				updated_at = CURRENT_TIMESTAMP
			WHERE id = $2
			RETURNING *`;

		const values = [JSON.stringify(photos), userId];

		const res = await pool.query(query, values);
		console.log('Updated user:', res.rows[0]);
		return res.rows[0]; // Retourne l'utilisateur mis à jour

	} catch (err) {
		console.error('Error executing query', err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
};
const insert_location = async (userId, latitude, longitude) => {
	try {
		const query = `
			UPDATE users
			SET 
				latitude = $1,
				longitude = $2,
				updated_at = CURRENT_TIMESTAMP
			WHERE id = $3
			RETURNING *`;

		const values = [latitude, longitude, userId];
		const res = await pool.query(query, values);
		console.log('Updated user:', res.rows[0]);
		return res.rows[0]; 

	} catch (err) {
		console.error('Error executing query', err.stack);
		throw err; // Lève une erreur si la requête échoue
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

const get_profil_spec_by_id = async (id) => {
	try {
		const query = `
			SELECT biography, interests, sexual_preference, gender 
			FROM users 
			WHERE id = $1
		`;
		const values = [id];

		const res = await pool.query(query, values);
		if (res.rows.length > 0) {
			console.log('User profile specs:', res.rows[0]);
			return res.rows[0]; // Retourne les informations spécifiques de l'utilisateur
		} else {
			console.log('User does not exist');
			return false;
		}
	} catch (err) {
		console.error('Error executing query', err.stack);
		return false;
	}
};
const get_profil_personal_by_id = async (id) => {
	try {
		const query = `
			SELECT email, username, firstname, lastname 
			FROM users 
			WHERE id = $1
		`;
		const values = [id];

		const res = await pool.query(query, values);
		if (res.rows.length > 0) {
			console.log('User profile specs:', res.rows[0]);
			return res.rows[0]; // Retourne les informations spécifiques de l'utilisateur
		} else {
			console.log('User does not exist');
			return false;
		}
	} catch (err) {
		console.error('Error executing query', err.stack);
		return false;
	}
};

const update_verification_status = async (userId) => {
	try {
		const query = `
			UPDATE users
			SET verified = false
			WHERE id = $1
			RETURNING *`;

		const values = [userId];

		const res = await
			pool.query(query, values);
		console.log('User verification status:', res.rows[0]);
		return res.rows[0]; // Retourne l'utilisateur mis à jour
	}
	catch (err) {
		console.error('Error executing query', err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
}


module.exports = {
	check_mail_user_exist,
	check_username_user_exist,
	createUser,
	check_verif_user,
	check_same_password,
	update_user_spec,
	insert_new_pictures,
	get_profil_spec_by_id,
	insert_location,
	get_profil_personal_by_id,
	update_user_info,
	getUserByUsername,
	getUserByEmail,
	update_verification_status
};
