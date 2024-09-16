const pool = require("../db.js"); // Importez la connexion depuis db.js

const AddMessage = async (senderId, receiverId, message) => {
	try {
		const query = `
		INSERT INTO messages (sender_id, receiver_id, message_text, sent_at)
		VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
		RETURNING *;
	  `;

		const values = [senderId, receiverId, message];

		const res = await pool.query(query, values);
		return res.rows[0]; // Renvoie la ligne insérée
	} catch (err) {
		console.error("Erreur lors de l'envoi du message", err);
		throw err; // Lève une exception en cas d'erreur
	}
};

const GetMessages = async (senderId, receiverId) => {
	try {
		const query = `
		SELECT * FROM messages
		WHERE (sender_id = $1 AND receiver_id = $2)
		OR (sender_id = $2 AND receiver_id = $1)
		ORDER BY sent_at;
	  `;

		const values = [senderId, receiverId];

		const res = await pool.query(query, values);
		return res.rows; // Renvoie les messages
	} catch (err) {
		console.error("Erreur lors de la récupération des messages", err);
		throw err; // Lève une exception en cas d'erreur
	}
}
module.exports = {
	AddMessage,
	GetMessages,
};
