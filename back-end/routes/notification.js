const express = require("express");
const jwt = require("jsonwebtoken"); // Pour generer le token JWT
const userQueries = require("../queries/index.js"); // importe index.js depuis le dossier queries
require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env
const authenticateToken = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/getNotification", authenticateToken, async (req, res) => {
	const userId = req.user.id;
	try {
		const notifications = await userQueries.GetNotifications(userId);
		console.log("Notifications in get notification routes :", notifications);
		return res.status(200).json(notifications);
	} catch (error) {
		console.error("Error in getNotification route:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.post("/addNotification", authenticateToken, async (req, res) => {
	try {
		const { type, message, userId } = req.body;

		if (!type || !message) {
			return res.status(400).json({ error: "Missing type or message" });
		}
		const notification = await userQueries.AddNotification(userId, type, message);
		return res.status(201).json(notification);
	} catch (error) {
		console.error("Error in addNotification route:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.post("deleteNoctification", authenticateToken, async (req, res) => {
	const userId = req.user.id;
	try {
		await userQueries.DeleteNotification(userId);
		return res.status(201).json({ message: "Notification deleted successfully" });
	} catch (error) {
		console.error("Error in deleteNotification route:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});
module.exports = router;
