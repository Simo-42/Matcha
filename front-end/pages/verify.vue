<template>
	<div>
		<!-- Notification -->
		<div v-if="showNotification" class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md">
			{{ notificationMessage }}
		</div>

		<!-- Formulaire d'authentification -->
		<Auth_form />
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Auth_form from "~/components/Auth_form.vue";

const route = useRoute();
const message = ref("");
const showNotification = ref(false);
const notificationMessage = ref("");

onMounted(async () => {
	const userId = route.params.id; // Récupère l'ID de l'utilisateur depuis l'URL
	try {
		// Envoie une requête GET au serveur pour vérifier l'email de l'utilisateur
		const response = await axios.get(`http://localhost:3005/verify/${userId}`);
		message.value = response.data; // Met à jour le message de succès

		// Affiche la notification
		notificationMessage.value = "Email valide";
		showNotification.value = true;

		// Masque la notification après 3 secondes
		setTimeout(() => {
			showNotification.value = false;
		}, 3000);
	} catch (error) {
		message.value = "Waiting for your";
	}
});
</script>

<style scoped>
/* Pas de styles nécessaires ici, car tout est géré par Tailwind */
</style>
