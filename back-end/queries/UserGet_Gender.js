const pool = require('../db.js');  // Importez la connexion depuis db.js
const bcrypt = require('bcryptjs');


const getWomenProfiles = async (userId) => {
    try {
        const query = 'SELECT * FROM users WHERE gender = $1 AND id != $2';
        const values = ['Woman', userId];

        const res = await pool.query(query, values);
        return res.rows;  // Retourne tous les profils féminins, sauf celui de l'utilisateur actuel
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};



const getMenProfiles = async (userId) => {
    try {
        const query = 'SELECT * FROM users WHERE gender = $1 AND id != $2';
        const values = ['Man', userId];

        const res = await pool.query(query, values);
        return res.rows;  // Retourne tous les profils masculins, sauf celui de l'utilisateur actuel
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};


const getBisexualProfiles = async (userId) => {
    try {
        const query = 'SELECT * FROM users WHERE sexual_preference = $1 AND id != $2';
        const values = ['Bisexual', userId];

        const res = await pool.query(query, values);
        return res.rows;  // Retourne tous les profils bisexuels, sauf celui de l'utilisateur actuel
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};


const getOtherProfiles = async (userId) => {
    try {
        const query = 'SELECT * FROM users WHERE sexual_preference = $1 AND id != $2';
        const values = ['Other', userId];

        const res = await pool.query(query, values);
        return res.rows;  // Retourne tous les profils "Other", sauf celui de l'utilisateur actuel
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};



module.exports = {getWomenProfiles, getMenProfiles, getBisexualProfiles, getOtherProfiles};