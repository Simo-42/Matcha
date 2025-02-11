const pool = require("../db.js"); // Importez la connexion depuis db.js

async function UserFakeProfile(userId) {
  try {
    const querySelect = "SELECT * FROM users WHERE id = $1";
    const values = [userId];

    const res = await pool.query(querySelect, values);

    if (res.rows.length > 0) {
      const queryUpdate =
        "UPDATE users SET fake_account = fake_account + 1 WHERE id = $1 RETURNING *";
      const resUpdate = await pool.query(queryUpdate, values);

      console.log("Fake account incrementé :", resUpdate.rows[0]);
      return true;
    } else {
      console.log("Utilisateur non trouvé");
      return false;
    }
  } catch (err) {
    console.error("Erreur lors de l'exécution de la requête", err.stack);
    return false;
  }
}

async function UserGetNumFake(UserId) {
  try {
    const query = "SELECT fake_account FROM users WHERE id = $1";
    const values = [UserId];

    const res = await pool.query(query, values);

    if (res.rows.length === 0) {
      return null; // Si l'utilisateur n'existe pas
    }

    return res.rows[0].fake_account; // Retourne le nombre de signalements
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err;
  }
}

module.exports = { UserFakeProfile, UserGetNumFake };
