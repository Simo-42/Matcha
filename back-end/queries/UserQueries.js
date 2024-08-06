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


const createUser = async (userInfo) => {
	const { email, password } = userInfo;
  
	try 
	{
	  const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
	  const values = [email, password];
  
	  const res = await pool.query(query, values); // Execute la requete
	  return res.rows[0]; // Retourne l'utilisateur créé
	} 
	catch (err) 
	{
	  console.error('Error executing query', err.stack);
	  throw err; // Lève une erreur si la requête échoue
	}
};

module.exports = { check_mail_user_exist, createUser };
