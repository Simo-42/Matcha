const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db.js");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware.js");
require("dotenv").config();
const router = express.Router();
const userQueries = require("../queries/index.js"); // Importe les fonctions depuis queries/index.js

const GENDERS = {
  MAN: "Man",
  WOMAN: "Woman",
};

const SEXUAL_PREFERENCES = {
  HETEROSEXUAL: "Heterosexual",
  GAY: "Gay",
  BISEXUAL: "Bisexual",
  OTHERS: "Others",
};

const getProfilesByGenderAndPreference = {
  // Pour les hommes
  [`${GENDERS.MAN}_${SEXUAL_PREFERENCES.HETEROSEXUAL}`]:
    userQueries.getHeterosexualWomenProfiles, // Montre  les femmes hétérosexuelles et bisexuelles
  [`${GENDERS.MAN}_${SEXUAL_PREFERENCES.GAY}`]: userQueries.getGayMenProfiles, // Montre uniquement les hommes de sexe_pref gay
  [`${GENDERS.MAN}_${SEXUAL_PREFERENCES.BISEXUAL}`]:
    userQueries.getWomenAndBisexualAndGayMenProfiles, // Montre tout les sexes_pref des femmes et les hommes 
  [`${GENDERS.MAN}_${SEXUAL_PREFERENCES.OTHERS}`]: userQueries.getOtherProfiles,

  // Pour les femmes
  [`${GENDERS.WOMAN}_${SEXUAL_PREFERENCES.HETEROSEXUAL}`]:
    userQueries.getHeterosexualMenProfiles, // Montre uniquement les hommes hétérosexuels
  [`${GENDERS.WOMAN}_${SEXUAL_PREFERENCES.GAY}`]:
    userQueries.getGayWomenProfiles, // Montre uniquement les femmes gays
  [`${GENDERS.WOMAN}_${SEXUAL_PREFERENCES.BISEXUAL}`]:
    userQueries.getMenAndBisexualAndGayWomenProfiles, // Montre les hommes hétéro/bisexuels, puis les femmes bisexuelles et gays
  [`${GENDERS.WOMAN}_${SEXUAL_PREFERENCES.OTHERS}`]:
    userQueries.getOtherProfiles,
};

router.get("/profil_to_match", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  console.log("Get user pics API called, userId:", userId);
  const searchCriteria = req.query; // Récupérer les critères de recherche depuis les paramètres de requête

  try {
    // Récupérer les informations du profil de l'utilisateur actuel
    const user = await userQueries.get_profil_spec_by_id(userId);
    console.log("User profile retrieved:", user);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    const key = `${user.gender}_${user.sexual_preference}`;
    const getProfilesFunction = getProfilesByGenderAndPreference[key];

    if (!getProfilesFunction) {
      console.log(
        `No profiles found for gender ${user.gender} and preference ${user.sexual_preference}`
      );
      return res.status(400).json({
        error: `No profiles found for gender ${user.gender} and preference ${user.sexual_preference}`,
      });
    }

    const allProfilesLiked = await userQueries.GetAllProfilesLikes(userId);
    let profiles = await getProfilesFunction(userId);
    const likedProfileIds = allProfilesLiked.map((profile) => profile.id);

    let filteredProfiles = profiles.filter(
      (profile) => !likedProfileIds.includes(profile.id)
    );
    await Promise.all(filteredProfiles.map(async (profile) => {
        profile.photos = await userQueries.get_user_pics(profile.id); // Ajouter les photos pour chaque profil
    }));
    profiles = filterAndSortProfiles(profiles, searchCriteria);

    // Retourner les profils filtrés
    res.status(200).json({ profiles: filteredProfiles });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const filterAndSortProfiles = (profiles, searchCriteria) => {
  const { age_gap, fame_rating_gap, interests, location_gap, sort_by } =
    searchCriteria;

  // Filtrage des profils en fonction des critères fournis
  if (age_gap) {
    const [age_min, age_max] = age_gap.split("-").map(Number);
    profiles = profiles.filter(
      (profile) => profile.age >= age_min && profile.age <= age_max
    );
  }

  if (fame_rating_gap) {
    const [fame_min, fame_max] = fame_rating_gap.split("-").map(Number);
    profiles = profiles.filter(
      (profile) =>
        profile.fame_rating >= fame_min && profile.fame_rating <= fame_max
    );
  }

  if (location_gap) {
    profiles = profiles.filter((profile) => profile.location === location_gap);
  }

  if (interests && interests.length) {
    profiles = profiles.filter((profile) => {
      const profileInterests = Array.isArray(profile.interests)
        ? profile.interests
        : JSON.parse(profile.interests);
      return interests.some((interest) => profileInterests.includes(interest));
    });
  }

  if (sort_by) {
    profiles.sort((a, b) => {
      switch (sort_by) {
        case "age":
          return a.age - b.age; // Tri par âge croissant
        case "location":
          return a.location.localeCompare(b.location);
        case "fame_rating":
          return b.fame_rating - a.fame_rating; // Tri par "fame rating" décroissant
        case "interests":
          const aCommonInterests = interests.filter((interest) =>
            a.interests.includes(interest)
          ).length;
          const bCommonInterests = interests.filter((interest) =>
            b.interests.includes(interest)
          ).length;
          return bCommonInterests - aCommonInterests;
        default:
          return 0; // Pas de tri si `sort_by` est inconnu
      }
    });
  }

  return profiles;
};

router.post("/like_profil", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { status, likedUserId } = req.body;
  console.log("Like status:", status);
  console.log("Like profil API called");

  try {
    let resultat;
    let match_result = false;

    if (status === "like") {
      resultat = await userQueries.UserLikeProfiles(userId, likedUserId);
      await userQueries.addGetFameRating(likedUserId, 3);
      console.log("Resultat:", resultat);

      match_result = await userQueries.checkMatch(userId, likedUserId);
      if (match_result === true) {
        await userQueries.CreateMatch(userId, likedUserId);
        console.log("Match found");
      }

      res.status(201).json({ resultat, match: match_result });
    } else if (status === "dislike") {
      resultat = await userQueries.UserDislikeProfiles(userId, likedUserId);
      console.log("Resultat:", resultat);

      res.status(201).json({ resultat, match: false });
    }
  } catch (error) {
    console.log("Error liking profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/match", authenticateToken, async (req, res) => {
  const { matchedUserId } = req.body;
  console.log("Match API called");
  const userId = req.user.id;

  try {
    const isMatch = await userQueries.checkMatch(userId, matchedUserId);
    if (isMatch === true) {
      console.log("Match found");
      return res.status(200).json({ message: "Match found" });
    } else {
      console.log("No match found");
      return res.status(404).json({ message: "No match found" });
    }
  } catch (error) {
    console.log("Error checking match:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
