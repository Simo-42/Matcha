const pool = require("../db.js"); // Importez la connexion depuis db.js
const bcrypt = require("bcryptjs");

const addGetFameRating = async (userId, points) => {
  try {
    const query = `
            UPDATE users 
            SET fame_rating = fame_rating + $1 
            WHERE id = $2 
            RETURNING fame_rating;
        `;
    const values = [points, userId];

    const res = await pool.query(query, values);
    return res.rows[0].fame_rating; // Retourne la nouvelle valeur de fame_rating
  } catch (err) {
    console.error("Error updating fame rating", err.stack);
    throw err;
  }
};

const removeFameRating = async (userId, points) => {
  try {
    const query = `
            UPDATE users 
            SET fame_rating = fame_rating - $1 
            WHERE id = $2 
            RETURNING fame_rating;
        `;
    const values = [points, userId];

    const res = await pool.query(query, values);
    return res.rows[0].fame_rating; // Retourne la nouvelle valeur de fame_rating
  } catch (err) {
    console.error("Error updating fame rating", err.stack);
    throw err;
  }
};

module.exports = { addGetFameRating, removeFameRating };
