const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db.js"); // Importez la connexion depuis db.js
const jwt = require("jsonwebtoken"); // Pour generer le token JWT
const userQueries = require("../queries/index.js"); // importe index.js depuis le dossier queries
const { send_email } = require("../utils/send_mail.js");
require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env
const router = express.Router();

router.post("/register", async (req, res) => {
	const { email, password, username, firstname, lastname } = req.body;

	// Hachage du mot de passe
	const hashed_password = await bcrypt.hash(password, 10);
	const info = {
		email: email,
		password: hashed_password,
		username: username,
		firstname: firstname,
		lastname: lastname,
	};

	try {
		// Vérifier si cet email est déjà enregistré dans la DB
		if ((await userQueries.check_mail_user_exist(email)) == true) {
			return res.status(400).json({ error: "Email is already registered." });
		} else if ((await userQueries.check_username_user_exist(username)) == true) {
			return res.status(400).json({ error: "This username is already taken." });
		}

		const user = await userQueries.createUser(info);
		if (!user) {
			return res.status(500).json({ error: "Error creating user" });
		}

		await send_email(email, user.id);

		res.status(201).json({
			message: "User registered successfully. Please check your email to verify your account.",
		});
	} catch (error) {
		console.log("Error checking existing user:", error); // Affiche une erreur si la vérification de l'utilisateur existant échoue
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.post("/authentification", async (req, res) => {
	const { username, password } = req.body;

	try {
		if (!(await userQueries.check_username_user_exist(username))) {
			return res.status(400).json({ error: "Username doesn't exist" });
		}

		const query = "SELECT * FROM users WHERE username = $1";
		const values = [username];
		const result = await pool.query(query, values);

		if (result.rows.length > 0) {
			const user = result.rows[0];
			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				return res.status(400).json({ error: "Incorrect password" });
			}
			if (!user.verified) {
				await send_email(user.email, user.id);
				return res.status(400).json({ error: "Email not verified. Verification email resent." });
			}

			const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRATION,
			});

			res.cookie("token", token, {
				httpOnly: true,
				secure: false,
				sameSite: "Strict",
				maxAge: 24 * 60 * 60 * 1000,
			});

			if ((await userQueries.UserGetNumFake(user.id)) >= 3) { // report number
				return res.status(400).json({
					error: "Your account has been reported as a fake profile too many times. Please contact support.",
				});
			}
			console.log("User authenticated successfully");
			return res.status(200).json({
				message: "Authentication successful",
				token,
				profile_complete: user.profile_complete,
			});
		} else {
			return res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		console.log("Error authenticating user:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/verify/:id", async (req, res) => {
	const userId = req.params.id;

	try {
		const query = "UPDATE users SET verified = TRUE WHERE id = $1 RETURNING *";
		const values = [parseInt(userId)];

		const result = await pool.query(query, values); // fais la requete

		if (result.rows.length > 0) {
			res.redirect(`http://localhost:3000/verify/${userId}`);
		} else {
			res.status(400).send("Email verification failed");
		}
	} catch (error) {
		console.log("Error verifying email:", error); // Affiche une erreur si la vérification de l'email échoue
		res.status(400).send("Email verification failed");
	}
});

module.exports = router;
