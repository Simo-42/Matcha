// userQueries.js
const pool = require('../db.js');  // Importez la connexion depuis db.js

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

module.exports = { check_mail_user_exist, check_username_user_exist , createUser, check_verif_user };
