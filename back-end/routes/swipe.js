const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db.js');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authMiddleware.js');
require('dotenv').config();
const router = express.Router();
const userQueries = require('../queries/index.js'); // Importe les fonctions depuis queries/index.js

const GENDERS = {
    MAN: 'Man',
    WOMAN: 'Woman',
};

const SEXUAL_PREFERENCES = {
    HETEROSEXUAL: 'Heterosexual',
    GAY: 'Gay',
    BISEXUAL: 'Bisexual',
    OTHERS: 'Others',
};

const getProfilesByGenderAndPreference = {
    [`${GENDERS.MAN}_${SEXUAL_PREFERENCES.HETEROSEXUAL}`]:  userQueries.getWomenProfiles,
    [`${GENDERS.MAN}_${SEXUAL_PREFERENCES.GAY}`]:  userQueries.getMenProfiles,
    [`${GENDERS.MAN}_${SEXUAL_PREFERENCES.BISEXUAL}`]:  userQueries.getBisexualProfiles,
    [`${GENDERS.MAN}_${SEXUAL_PREFERENCES.OTHERS}`]:  userQueries.getOtherProfiles,
    
    [`${GENDERS.WOMAN}_${SEXUAL_PREFERENCES.HETEROSEXUAL}`]:  userQueries.getMenProfiles,
    [`${GENDERS.WOMAN}_${SEXUAL_PREFERENCES.GAY}`]:  userQueries.getWomenProfiles,
    [`${GENDERS.WOMAN}_${SEXUAL_PREFERENCES.BISEXUAL}`]:  userQueries.getBisexualProfiles,
    [`${GENDERS.WOMAN}_${SEXUAL_PREFERENCES.OTHERS}`]:  userQueries.getOtherProfiles,
};

router.get('/profil_to_match', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    console.log("Get user pics API called");

    try {
        const user = await userQueries.get_profil_spec_by_id(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const key = `${user.gender}_${user.sexual_preference}`;
        const getProfilesFunction = getProfilesByGenderAndPreference[key];
        console.log('Key:', key);
        if (getProfilesFunction) {
            const profiles = await getProfilesFunction(userId);  
            console.log('Profiles:', profiles);
            return res.status(200).json({ message: 'Profiles retrieved successfully', profiles });
        } else {
            return res.status(400).json({ error: 'Invalid gender or sexual preference' });
        }
    } catch (error) {
        console.log('Error fetching profiles:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
