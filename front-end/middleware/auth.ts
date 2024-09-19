import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import axios from "axios";


export default defineNuxtRouteMiddleware(async (to, from) => {
	try {
		const response = await axios.get("http://localhost:3005/api/jwt/verify-auth", { withCredentials: true });
		console.log("response", response.data.authenticated);
		if (!response.data.authenticated) {
			console.log("Utilisateur non authentifié");
			return navigateTo("/auth");
		}
	} catch (error) {
		console.log("Erreur lors de la vérification de l'authentification", error);
		return navigateTo("/auth"); // Redirige vers la page d'authentification en cas d'erreur
	}
});
