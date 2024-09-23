const pool = require("../db.js"); // Importez la connexion depuis db.js
const bcrypt = require("bcryptjs");

const updateConnectionStatus = async (userId, status) => {
	try {
		const query = "UPDATE users SET connected = $1 WHERE id = $2";
		const values = [status, userId];

		await pool.query(query, values);
		console.log("User connection status updated");
		return true;
	}
	catch (err) {
		console.error("Error executing query", err.stack);
		return false;
	}
}
const GetUserStatus = async (userId) => {
	try {
		const query = "SELECT connected FROM users WHERE id = $1";
		const values = [userId];
		const result = await pool.query(query, values);
		return result.rows[0].connected;
	} catch (error) {
		console.error("Error during getting user status:", error);
	}
}
module.exports = {
	updateConnectionStatus,
	GetUserStatus
};