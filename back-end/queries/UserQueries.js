const pool = require('../db.js');  // Importez la connexion depuis db.js
const bcrypt = require('bcryptjs');

// userQueries.js
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
const insert_location = async (userId, location) => {
	try {
		const query = `
			UPDATE users
			SET 
				location = $1,
				updated_at = CURRENT_TIMESTAMP
			WHERE id = $2
			RETURNING *`;

		const values = [location, userId];
		const res = await pool.query(query, values);
		console.log('Updated user:', res.rows[0]);
		return res.rows[0]; 

	} catch (err) {
		console.error('Error executing query', err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
};



module.exports = {
	createUser,
	insert_new_pictures,
	insert_location
};
