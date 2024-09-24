const pool = require("../db.js"); // Importez la connexion depuis db.js

const AddNotification = async (userId, type, message) => {
	try {
		const query = `
		INSERT INTO notifications (user_id, type, message, created_at)
		VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
		RETURNING *;
	  `;

		const values = [userId, type, message];

		const res = await pool.query(query, values);
		return res.rows[0]; 
	} catch (err) {
		console.error("Erreur lors de l'envoi du message", err);
		throw err; 
	}
}

const NotificationIsRead = async (userId) => {
	try {
		const query = `
		UPDATE notifications
		SET is_read = true
		WHERE user_id = $1
		RETURNING *;
	  `;

		const values = [userId];
		await pool.query(query, values);
		return true; 
	}
	catch (err) {
		console.error("Erreur lors de l'envoi du message", err);
		throw err; 
	}
}

const DeleteNotification = async (userId) => {
	try {
		const query = `
		DELETE FROM notifications
		WHERE user_id = $1
		RETURNING *;
	  `;

		const values = [userId];
		await pool.query(query, values);
		return true; 
	}
	catch (err) {
		console.error("Erreur lors de l'envoi du message", err);
		throw err; 
	}
}

const GetNotifications = async (userId) => {
	try {
		const query = `
		SELECT * FROM notifications
		WHERE user_id = $1
		ORDER BY created_at;
	  `;

		const values = [userId];

		const res = await pool.query(query, values);
		return res.rows; // Renvoie les messages
	} catch (err) {
		console.error("Erreur lors de la récupération des messages", err);
		throw err; 
	}
};

module.exports = {
	AddNotification,
	NotificationIsRead,
	DeleteNotification,
	GetNotifications
};
