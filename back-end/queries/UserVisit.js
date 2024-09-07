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
const GetProfileVisitors = async (userIdTo) => {
	try { 
	  const query = `
		SELECT u.id, u.username, u.firstname, u.lastname, u.interests, u.age, u.fame_rating, u.gender, u.sexual_preference, u.location,u.biography, u.photos, pv.visited_at 
		FROM profile_visits pv
		JOIN users u ON pv.user_id_from = u.id
		WHERE pv.user_id_to = $1
		ORDER BY pv.visited_at DESC;
	  `;
	  // u. conrespond à la table users et pv. correspond à la table profile_visits
	  const values = [userIdTo];
  
	  const res = await pool.query(query, values);
  
	  if (res.rows.length === 0) {
		return []; // Si aucun visiteur n'a été trouvé
	  }
  
	  return res.rows;  // Retourne les informations complètes des visiteurs
	} catch (err) {
	  console.error("Erreur lors de la récupération des visiteurs de profil", err);
	  throw err;  // Lève une exception en cas d'erreur
	}
  };
  
  
  
  
module.exports = {SetProfileVisited, GetProfileVisitors}
