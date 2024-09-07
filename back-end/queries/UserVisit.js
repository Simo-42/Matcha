const pool = require('../db.js') // Importez la connexion depuis db.js
const bcrypt = require('bcryptjs')

const SetProfileVisited = async (userIdFrom, userIdTo) => {
  try {
    const query = `
      INSERT INTO profile_visits (user_id_from, user_id_to, visited_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id_from, user_id_to)
      DO UPDATE SET visited_at = EXCLUDED.visited_at
      RETURNING *;
    `;
    const values = [userIdFrom, userIdTo];

    const res = await pool.query(query, values);
    return res.rows[0];  // Renvoie la ligne insérée ou mise à jour
  } catch (err) {
    console.error("Erreur lors de l'enregistrement de la visite de profil", err);
    throw err;  // Lève une exception en cas d'erreur
  }
};

  
  
module.exports = {SetProfileVisited}
