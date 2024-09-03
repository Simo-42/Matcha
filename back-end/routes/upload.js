const express = require("express");
const jwt = require("jsonwebtoken"); // Pour générer le token JWT
const authenticateToken = require("../middleware/authMiddleware.js");
const multer = require("multer"); // Importer multer pour la gestion des fichiers
const path = require("path"); // Importer path pour la manipulation des chemins de fichiers
const fs = require("fs"); // Importer fs pour gérer les fichiers et dossiers
require("dotenv").config(); // Charger les variables d'environnement depuis le fichier .env
const router = express.Router();

const userQueries = require("../queries/index.js"); // Importer index.js depuis le dossier queries

// Configuration de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user.id;
    const dir = path.join(__dirname, "..", "uploads", "users", String(userId));

    // Créer le dossier de l'utilisateur s'il n'existe pas
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5 Mo par fichier
    fieldSize: 25 * 1024 * 1024, // Limite de 25 Mo pour la taille des champs de texte
    files: 5, // Nombre maximum de fichiers
  },
});

// Route pour uploader les photos
router.post(
  "/pictures",
  authenticateToken,
  upload.array("pictures", 5),
  async (req, res) => {
    const userId = req.user.id; // Utiliser `req.user` pour accéder aux informations de l'utilisateur
    console.log("Received files:", req.files);
    console.log("User ID:", req.user.id);

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      req.files.forEach((file) => {
        console.log(
          `Received file: ${file.originalname}, Size: ${file.size} bytes`
        );
      });

      // Créer les chemins publics des fichiers à partir des fichiers uploadés
      let picturePaths = req.files.map(
        (file) => `/uploads/users/${userId}/${file.filename}`
      );
      console.log("Picture paths:", picturePaths);

      // Mettre à jour les photos de l'utilisateur dans la base de données
      const user = await userQueries.insert_new_pictures(userId, picturePaths);
      if (!user) {
        console.log("Error updating user photos");
        return res
          .status(500)
          .json({ error: "Error updating user information" });
      }

      console.log("User photos updated successfully:", user);

      // Mettre à jour l'état du profil utilisateur pour indiquer qu'il est complet
      const update_user = await userQueries.update_profile_complete(userId);
      if (!update_user) {
        console.log("Error updating user profile completion status");
        return res
          .status(500)
          .json({ error: "Error updating user information" });
      }

      console.log(
        "User profile completion status updated successfully:",
        update_user
      );
      return res
        .status(200)
        .json({ message: "User photos updated successfully", user });
    } catch (error) {
      console.log("Error updating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/update_pics",
  authenticateToken,
  upload.array("pictures", 5),
  async (req, res) => {
    const userId = req.user.id; // Utiliser `req.user` pour accéder aux informations de l'utilisateur
    console.log("Received files:", req.files);
    console.log("User ID:", req.user.id);

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      req.files.forEach((file) => {
        console.log(
          `Received file: ${file.originalname}, Size: ${file.size} bytes`
        );
      });

      // Créer les chemins publics des fichiers à partir des fichiers uploadés
      let picturePaths = req.files.map(
        (file) => `/uploads/users/${userId}/${file.filename}`
      );
      console.log("Picture paths:", picturePaths);

      // Mettre à jour les photos de l'utilisateur dans la base de données
      const user = await userQueries.update_pictures(userId, picturePaths);
      if (!user) {
        console.log("Error updating user photos");
        return res
          .status(500)
          .json({ error: "Error updating user information" });
      }

      return res
        .status(200)
        .json({ message: "User photos updated successfully", user });
    } catch (error) {
      console.log("Error updating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/get_pics", authenticateToken, async (req, res) => {
  const userId = req.user.id; // Utiliser `req.user` pour accéder aux informations de l'utilisateur
  console.log("User ID:", userId);

  try {
    const photos = await userQueries.get_pictures(userId);
    if (!photos) {
      return res.status(404).json({ error: "Photos not found" });
    }
    console.log("Photos fetched successfully:", photos);
    return res
      .status(200)
      .json({ message: "Photos fetched successfully", photos });
  } catch (error) {
    console.log("Error fetching photos:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Exporter le routeur
module.exports = router;
