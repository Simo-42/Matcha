const pool = require("../db.js"); // Importez la connexion depuis db.js

async function getUserByEmail(email) {
  try {
    const query = "SELECT id FROM users WHERE email = $1";
    const values = [email];

    const res = await pool.query(query, values);
    return res.rows[0]; // Retourne l'utilisateur si l'email existe
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err;
  }
}

async function getUserByUsername(username) {
  try {
    const query = "SELECT id FROM users WHERE username = $1";
    const values = [username];

    const res = await pool.query(query, values);
    return res.rows[0]; // Retourne l'utilisateur si le nom d'utilisateur existe
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err;
  }
}

async function get_profil_spec_by_id(id) {
  try {
    const query = `
			SELECT biography, interests, sexual_preference, gender, username, photos
			FROM users 
			WHERE id = $1
		`;
    const values = [id];

    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      // console.log("User profile specs:", res.rows[0]);
      return res.rows[0]; // Retourne les informations spécifiques de l'utilisateur
    } else {
      console.log("User does not exist");
      return false;
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
    return false;
  }
}
async function get_profil_personal_by_id(id) {
  try {
    const query = `
			SELECT email, username, firstname, lastname 
			FROM users 
			WHERE id = $1
		`;
    const values = [id];

    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      // console.log("User profile specs:", res.rows[0]);
      return res.rows[0]; // Retourne les informations spécifiques de l'utilisateur
    } else {
      // console.log("User does not exist");
      return false;
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
    return false;
  }
}

async function get_profil_complete(id) {
  try {
    const query = `
			FROM users 
			WHERE id = $1
		`;
    const values = [id];
    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      // console.log("User profile specs:", res.rows[0]);
      return res.rows[0].profil_complete; // Retourne les informations spécifiques de l'utilisateur
    } else {
      // console.log("User does not exist");
      return false;
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
    return false;
  }
}

async function get_my_profil_info(id) {
  try {
    const query = `
			SELECT email, username, firstname, lastname, gender, biography, interests, age,  sexual_preference, location, photos, profile_complete
			FROM users 
			WHERE id = $1
		`;
    const values = [id];
    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      // console.log('User profile specs:', res.rows[0]);
      return res.rows[0];
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
    return false;
  }
}

async function get_user_pics(id) {
  try {
    const query = `
			SELECT photos 
			FROM users 
			WHERE id = $1
		`;
    const values = [id];
    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      // console.log("User profile specs:", res.rows[0]);
      return res.rows[0].photos;
    } else {
      console.log("User does not exist");
      return false;
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
    return false;
  }
}

module.exports = {
  getUserByEmail,
  getUserByUsername,
  get_profil_spec_by_id,
  get_profil_personal_by_id,
  get_profil_complete,
  get_user_pics,
  get_my_profil_info,
};
