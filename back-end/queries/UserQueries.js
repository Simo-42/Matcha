// userQueries.js
const pool = require('../db.js');  // Importez la connexion depuis db.js
const bcrypt = require('bcryptjs');

const check_mail_user_exist = async (email) => {
  try {
	const query = 'SELECT * FROM users WHERE email = $1';
	const values = [email];

	const res = await pool.query(query, values);
	if (res.rows.length > 0) 
	{	
		console.log('User email exists:', res.rows[0]);
		return true ; 
	} 
	else 
	{
		console.log('User email does not exist he can register');
		return false ; 
	}
} 
  catch (err) 
	{
	console.error('Error executing query', err.stack);
	return false ; 
	}
};

const check_verif_user = async (verified) => {
	try {
	  const query = 'SELECT * FROM users WHERE verified = $1';
	  const values = [verified];
  
	  const res = await pool.query(query, values);
	  if (res.rows.length > 0) 
	  {	
		  console.log('User is verified ', res.rows[0]);
		  return true ; 
	  } 
	  else 
	  {
		  console.log('User is not verified need to be verified');
		  return false ; 
	  }
  } 
	catch (err) 
	  {
	  console.error('Error executing query', err.stack);
	  return false ; 
	  }
};

const check_username_user_exist = async (username) => {
	try {
	  const query = 'SELECT * FROM users WHERE username = $1';
	  const values = [username];
  
	  const res = await pool.query(query, values);
	  if (res.rows.length > 0) 
	  {	
		  console.log('User username exists:', res.rows[0]);
		  return true ; // User existe ne peut pas s'inscrire
	  } 
	  else 
	  {
		  console.log('User username does not exist he can register');
		  return false ; // user existe  peut s'inscrire 
	  }
  	} 
	catch (err) 
	  {
	  console.error('Error executing query', err.stack);
	  return false ; 
	  }
  };

  const createUser = async (userInfo) => {
	const { email, password, username, firstname, lastname } = userInfo;
	
	try {
	  const query = `
		INSERT INTO users (email, password, username, firstname, lastname)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *`;
	  
	  // Les valeurs à insérer dans la requête SQL
	  const values = [email, password, username, firstname, lastname];
	
	  // Exécution de la requête SQL
	  const res = await pool.query(query, values);
	  
	  // Retourne l'utilisateur créé
	  return res.rows[0];
	} catch (err) {
	  console.error('Error executing query', err.stack);
	  throw err; // Lève une erreur si la requête échoue
	}
  };

  const update_user_spec = async (userId, userInfo) => {
	const { gender, sexual_preference, biography, interests } = userInfo;
	try {
	  const query = `
		UPDATE users
		SET gender = $1,
			sexual_preference = $2,
			biography = $3,
			interests = $4,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $5
		RETURNING *`;
  
	  const values = [gender, sexual_preference, biography, JSON.stringify(interests), userId];
	  // Note: JSON.stringify est utilisé pour s'assurer que 'interests' est stocké correctement en tant que JSON
  
	  const res = await pool.query(query, values);
	 console.log('res :) ', res.rows[0]); 
	  return res.rows[0]; // Retourne l'utilisateur mis à jour
	  
	} catch (err) {
	  console.error('Error executing query', err.stack);
	  throw err; // Lève une erreur si la requête échoue
	}
  };
  


  const check_same_password = async (username, new_password) => {
	try {
	  const query = 'SELECT password FROM users WHERE username = $1';
	  const values = [username];
  
	  // Exécute la requête pour récupérer le mot de passe actuel de l'utilisateur
	  const res = await pool.query(query, values);
  
	  if (res.rows.length > 0) {
		const existingPassword = res.rows[0].password;
  
		// Compare le mot de passe actuel avec le nouveau mot de passe
		const passwordMatch = await bcrypt.compare(new_password, existingPassword);
  
		if (passwordMatch) {
		  console.log('The new password is the same as the current password.');
		  return true; // Le nouveau mot de passe est identique à l'actuel
		} else {
		  console.log('The new password is different from the current password.');
		  return false; // Le nouveau mot de passe est différent de l'actuel
		}
	  } else {
		console.log('User not found.');
		return false; // L'utilisateur n'a pas été trouvé
	  }
	} catch (err) {
	  console.error('Error executing query', err.stack);
	  return false;
	}
  };


module.exports = { check_mail_user_exist, check_username_user_exist , createUser, check_verif_user, check_same_password, update_user_spec };
