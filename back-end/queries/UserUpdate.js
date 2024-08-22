const pool = require('../db.js');  // Importez la connexion depuis db.js
const bcrypt = require('bcryptjs');

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

module.exports = { update_user_spec, update_user_info, update_verification_status };