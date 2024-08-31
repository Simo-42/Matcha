const pool = require('../db.js');  // Importez la connexion depuis db.js

const getWomenProfiles = async (userId) => {
    try {
        const query = 'SELECT id, email, username, firstname, lastname, biography, gender, sexual_preference, location, interests FROM users WHERE gender = $1 AND id != $2';
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
        const query = 'SELECT id, email, username, firstname, lastname, biography, gender, sexual_preference, location, interests FROM users WHERE gender = $1 AND id != $2';
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
        const query = `
            SELECT id, email, username, firstname, lastname, biography, gender, sexual_preference, location, interests
            FROM users 
            WHERE id != $1
        `;
        const values = [userId];

        const res = await pool.query(query, values);
        return res.rows; 
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

const getOtherProfiles = async (userId) => {
    try {
        const query = 'SELECT id, email, username, firstname, lastname, biography, gender, sexual_preference, location, interests FROM users WHERE sexual_preference = $1 AND id != $2';
        const values = ['Other', userId];

        const res = await pool.query(query, values);
        return res.rows;  // Retourne tous les profils "Other", sauf celui de l'utilisateur actuel
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

module.exports = {getWomenProfiles, getMenProfiles, getBisexualProfiles, getOtherProfiles};
