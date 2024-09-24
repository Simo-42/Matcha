const express = require("express");
const authenticateToken = require("../middleware/authMiddleware.js");
const router = express.Router();
const userQueries = require("../queries/index.js");

router.post("/send_message", authenticateToken, async (req, res) => {
	const { message, receiver_id } = req.body;
	const sender_id = req.user.id;
	console.log("Sender ID:", sender_id);
	if (!message || !receiver_id) {
		return res.status(400).json({ error: "Message or receiver ID is missing" });
	}

	if (message.length > 3000) {
		return res.status(400).json({ error: "Message is too long. Max 3000 characters allowed" });
	}

	console.log("Message API called");

	try {
		await userQueries.AddMessage(sender_id, receiver_id, message);
		return res.status(200).json({ message: "Message sent successfully" });
	} catch (error) {
		console.error("Error while sending message:", error);
		return res.status(500).json({ error: "Internal server error. Please try again later" });
	}
});

router.get("/get_messages", authenticateToken, async (req, res) => {
	const sender_id = req.user.id;
	const receiver_id = req.query.receiver_id;  // Pour recuperer le receiver_id
	console.log("Get messages API called");
	console.log("Sender ID:", sender_id);
	console.log("Receiver ID:", receiver_id);
	if (!receiver_id) {
		return res.status(400).json({ error: "Receiver ID is missing" });
	}
	try {
		const messages = await userQueries.GetMessages(sender_id, receiver_id);

		if (messages.length === 0) {
			return res.status(204).json({ error: "No messages found" });
		}
		return res.status(200).json(messages);
	} catch (error) {
		console.error("Error while getting messages:", error);
		return res.status(500).json({ error: "Internal server error. Please try again later" });
	}
});

module.exports = router;
