const nodemailer = require("nodemailer");
require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env
const pool = require("../db.js"); // Importez la connexion depuis db.js
const crypto = require("crypto");

const generateResetToken = async (email) => {
	const resetToken = crypto.randomBytes(20).toString("hex");
	const resetTokenExpires = new Date(Date.now() + 3600000); // 1 heure d'expiration
	console.log("jai generer le token ici");
	const query = `
	  UPDATE users
	  SET reset_token = $1, reset_token_expires = $2
	  WHERE email = $3
	  RETURNING *`;

	const values = [resetToken, resetTokenExpires, email];
	const result = await pool.query(query, values);

	if (result.rows.length === 0) {
		throw new Error("No user found with that email address.");
	}

	return resetToken;
};

module.exports = { generateResetToken };
