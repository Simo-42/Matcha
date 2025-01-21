const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	// Si pas de token dans l'en-tête, vérifie le cookie
	const cookieToken = req.cookies.token;

	if (!token && !cookieToken) {
		console.log("No token provided");
		return res.sendStatus(401); // Unauthorized
	}

	jwt.verify(token || cookieToken, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			console.log("Token verification failed:", err.message);
			return res.sendStatus(403); // Forbidden
		}

		req.user = user;
		next();
	});
};

module.exports = authenticateToken;
