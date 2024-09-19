<template>
	<div>
		<Logout />
		<p>This is a test page</p>
		<!-- <user_form /> -->
		<p> {{ randomNumber }} </p>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import user_form from "~/components/User_form.vue";
import usermod from "~/components/User_mod.vue";
const { $socket } = useNuxtApp();
const randomNumber = ref(0);
onMounted(() => {
	// Écouter l'événement 'randomUpdate' envoyé par le serveur
	console.log("mounted", $socket);
	
	$socket.on("randomUpdate", (number) => {
		randomNumber.value = number; // Mettre à jour le nombre en temps réel
	});
});
</script>
