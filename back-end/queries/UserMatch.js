const pool = require("../db.js"); // Importez la connexion depuis db.js

const UserLikeProfiles = async (userId, likedUserId) => {
	try {
		const query = `
      INSERT INTO likes (user_id_from, user_id_to, liked, liked_at)
      VALUES ($1, $2, true, CURRENT_TIMESTAMP)
      RETURNING *`;

		const values = [userId, likedUserId];

		const res = await pool.query(query, values);
		console.log("Like recorded:", res.rows[0]);
		return res.rows[0]; // Retourne l'entrée ajoutée à la table `likes`
	} catch (err) {
		console.error("Error executing query", err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
};

const UserDislikeProfiles = async (userId, likedUserId) => {
	try {
		const query = `
		INSERT INTO likes (user_id_from, user_id_to, liked, liked_at)
		VALUES ($1, $2, false, CURRENT_TIMESTAMP)
		RETURNING *`;

		const values = [userId, likedUserId];

		const res = await pool.query(query, values);
		console.log("Dislike recorded:", res.rows[0]);
		return res.rows[0]; // Retourne l'entrée ajoutée à la table `likes`
	} catch (err) {
		console.error("Error executing query", err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
};
const GetAllProfilesLikes = async (userId) => {
	try {
		const query = `
            SELECT users.id, users.firstname, users.lastname, likes.liked, likes.liked_at
            FROM likes
            JOIN users ON users.id = likes.user_id_to
            WHERE likes.user_id_from = $1
            ORDER BY likes.liked_at DESC
        `;

		const values = [userId];

		const res = await pool.query(query, values);
		console.log("Profiles liked/disliked by user:", res.rows);
		return res.rows; // Retourne les profils likés ou dislikés avec les détails
	} catch (err) {
		console.error("Error executing query", err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
};

const checkMatch = async (userId1, userId2) => {
	try {
		const query = `
		SELECT 
		  (SELECT COUNT(*) FROM likes WHERE user_id_from = $1 AND user_id_to = $2 AND liked = true) > 0 
		  AND 
		  (SELECT COUNT(*) FROM likes WHERE user_id_from = $2 AND user_id_to = $1 AND liked = true) > 0
		  AS is_match;
	  `;
		// Check if both users liked each other
		const values = [userId1, userId2];

		const res = await pool.query(query, values);
		return res.rows[0].is_match; // Retourne `true` si les deux utilisateurs se sont likés
	} catch (err) {
		console.error("Error executing query", err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
};

const CreateMatch = async (userId1, userId2) => {
	try {
		const [user1, user2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

		const checkQuery = `
            SELECT id
            FROM matches
            WHERE user_id_1 = $1 AND user_id_2 = $2
        `;
		const checkValues = [user1, user2];
		const checkResult = await pool.query(checkQuery, checkValues);

		if (checkResult.rows.length > 0) {
			// Match already exists, return the existing match
			return { matchExists: true, match: checkResult.rows[0] };
		}

		// Insérez le nouveau match dans la base de données
		const insertQuery = `
            INSERT INTO matches (user_id_1, user_id_2, matched_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            RETURNING *
        `;
		const insertValues = [user1, user2];
		const insertResult = await pool.query(insertQuery, insertValues);

		console.log("Match created:", insertResult.rows[0]);
		return { matchExists: false, match: insertResult.rows[0] };
	} catch (err) {
		console.error("Error creating match:", err.stack);
		throw err; // Lève une erreur si la requête échoue
	}
};
const GetAllUsersMatchs = async (userId) => {
	try {
		const query = `
		SELECT u.id, u.username, u.firstname, u.lastname, u.interests, u.age, u.fame_rating, u.gender, u.sexual_preference, u.location, u.biography, u.photos, m.matched_at, u.connected
		FROM matches m
		JOIN users u ON (m.user_id_1 = u.id OR m.user_id_2 = u.id)
		WHERE (m.user_id_1 = $1 OR m.user_id_2 = $1) 
		AND u.id != $1
		ORDER BY m.matched_at DESC;
	  	`;
		const values = [userId];
		const res = await pool.query(query, values);
		if (res.rows.length === 0) {
			return [];
		}

		return res.rows;
	} catch (err) {
		console.error("Erreur lors de la récupération des matchs", err);
		throw err;
	}
};

module.exports = {
	UserLikeProfiles,
	UserDislikeProfiles,
	checkMatch,
	GetAllProfilesLikes,
	CreateMatch,
	GetAllUsersMatchs,
}; // Exportez les fonctions pour les utiliser dans d'autres fichiers
