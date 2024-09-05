const pool = require("../db.js"); // Importez la connexion depuis db.js

const getHeterosexualWomenProfiles = async (userId) => {
  try {
	const query = `
			SELECT id, email, username, firstname, lastname, biography, age, gender, sexual_preference, location, interests 
			FROM users 
			WHERE gender = $1 AND sexual_preference = $2 AND id != $3
		`;
	const values = ["Woman", "Heterosexual", userId];

	const res = await pool.query(query, values);
	return res.rows; // Retourne tous les profils féminins hétérosexuels, sauf celui de l'utilisateur actuel
  } catch (err) {
	console.error("Error executing query", err.stack);
	throw err;
  }
};

const getGayMenProfiles = async (userId) => {
  try {
	const query = `
			SELECT id, email, username, firstname, lastname, biography, age, gender, sexual_preference, location, interests 
			FROM users 
			WHERE gender = $1 AND sexual_preference = $2 AND id != $3
		`;
	const values = ["Man", "Gay", userId];

	const res = await pool.query(query, values);
	return res.rows; // Retourne tous les profils masculins hétérosexuels, sauf celui de l'utilisateur actuel
  } catch (err) {
	console.error("Error executing query", err.stack);
	throw err;
  }
};

const getGayWomenProfiles = async (userId) => {
  try {
	const query = `
			SELECT id, email, username, firstname, lastname, biography, age, gender, sexual_preference, location, interests 
			FROM users 
			WHERE gender = $1 AND sexual_preference = $2 AND id != $3
		`;
	const values = ["Woman", "Gay", userId];

	const res = await pool.query(query, values);
	return res.rows; // Retourne tous les profils féminins gays, sauf celui de l'utilisateur actuel
  } catch (err) {
	console.error("Error executing query", err.stack);
	throw err;
  }
};

const getHeterosexualMenProfiles = async (userId) => {
  try {
	const query = `
			SELECT id, email, username, firstname, lastname, biography, age, gender, sexual_preference, location, interests 
			FROM users 
			WHERE gender = $1 AND sexual_preference = $2 AND id != $3
		`;
	const values = ["Man", "Heterosexual", userId];

	const res = await pool.query(query, values);
	return res.rows; // Retourne tous les profils masculins hétérosexuels, sauf celui de l'utilisateur actuel
  } catch (err) {
	console.error("Error executing query", err.stack);
	throw err;
  }
};

const getWomenAndBisexualAndGayMenProfiles = async (userId) => {
  try {
	const query = `
		SELECT id, email, username, firstname, lastname, biography, age, gender, sexual_preference, location, interests 
		FROM users 
		WHERE 
		  ((gender = $1 AND sexual_preference IN ($2, $3)) 
		  OR 
		  (gender = $4 AND sexual_preference IN ($3, $5))) 
		  AND id != $6
	  `;
	const values = ["Woman", "Heterosexual", "Bisexual", "Man", "Gay", userId];

	const res = await pool.query(query, values);
	return res.rows; // Retourne les femmes hétérosexuelles/bisexuelles, et les hommes bisexuels/homosexuels (gay)
  } catch (err) {
	console.error("Error executing query", err.stack);
	throw err;
  }
};

const getMenAndBisexualAndGayWomenProfiles = async (userId) => {
	try {
	  const query = `
		SELECT id, email, username, firstname, lastname, biography, age, gender, sexual_preference, location, interests 
		FROM users 
		WHERE 
		  ((gender = $1 AND sexual_preference IN ($2, $3)) 
		  OR 
		  (gender = $4 AND sexual_preference IN ($3, $5))) 
		  AND id != $6
	  `;
	  const values = ["Man", "Heterosexual", "Bisexual", "Woman", "Gay", userId];
  
	  const res = await pool.query(query, values);
	  return res.rows; // Retourne les hommes hétérosexuels/bisexuels, et les femmes bisexuelles/homosexuelles (gay)
	} catch (err) {
	  console.error("Error executing query", err.stack);
	  throw err;
	}
  };
const getOtherProfiles = async (userId) => {
  try {
	const query = `
			SELECT id, email, username, firstname, lastname, biography, age, gender, sexual_preference, location, interests 
			FROM users 
			WHERE sexual_preference = $1 AND id != $2
		`;
	const values = ["Other", userId];

	const res = await pool.query(query, values);
	return res.rows; // Retourne tous les profils "Other", sauf celui de l'utilisateur actuel
  } catch (err) {
	console.error("Error executing query", err.stack);
	throw err;
  }
};

module.exports = {
  getHeterosexualWomenProfiles,
  getHeterosexualMenProfiles,
  getMenAndBisexualAndGayWomenProfiles,
  getOtherProfiles,
  getWomenAndBisexualAndGayMenProfiles,
  getGayMenProfiles,
  getGayWomenProfiles,
};
