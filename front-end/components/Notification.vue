<template>
	<div
		role="alert"
		class="alert shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="stroke-info h-6 w-6 shrink-0">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
		</svg>
		<div>
			<h3 class="font-bold">New message!</h3>
			<div class="text-xs">You have 1 unread message</div>
		</div>
		<button class="btn btn-sm">See</button>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const { $socket } = useNuxtApp();
const notifcation = ref({});
const number = ref(0);
const my_profile_id = ref(0);

async function fetchAllNotification() {
	try {
		const response = await axios.get("http://localhost:3005/api/notification/getNotification", {
			withCredentials: true,
		});
		console.log("response.data", response.data);
	} catch (error) {
		console.error("Error fetching profile data:", error);
		message.value = "Failed to load profile information.";
	}
}

onMounted(async () => {
	await fetchAllNotification();
	// const { $socket } = useNuxtApp();
	// const userId = my_profile_id.value;

	// $socket.io.opts.query = { userId }; // Passer l'ID de l'utilisateur connecté au serveur
	// $socket.io.opts.transports = ["websocket"]; // Forcer WebSocket sinon le serveur utilise polling par défaut
	// $socket.connect();
});
</script>

<style scoped>
html,
body {
	height: 100%;
	background-color: white;
}
</style>
