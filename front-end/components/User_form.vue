<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-100">
		<form @submit.prevent="submitForm" class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
			<Gender_select :selectedGender="selectedGender" @updateGender="updateGender" />
			<Sexual_pref :selectedSexualPref="selectedSexualPref" @updateSexualPref="updateSexualPref" />
			<Biography_form :bio="bio" @updateBio="updateBio" />
			<Interests_select :selectedInterests="selectedInterests" @updateInterests="updateInterests" />
			<button type="submit" class="mt-6 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Soumettre</button>
		</form>
	</div>
	<div class="text-center mt-4 text-red-500">{{ message }}</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Biography_form from "~/components/profil/biography.vue";
import Gender_select from "~/components/profil/gender.vue";
import Sexual_pref from "~/components/profil/sexual_pref.vue";
import Interests_select from "~/components/profil/interests.vue";

const selectedGender = ref("");
const selectedSexualPref = ref("");
const bio = ref(""); // Renommé ici
const selectedInterests = ref([]);
const message = ref("");

function updateGender (newGender)  {
	selectedGender.value = newGender;
};

function updateSexualPref (newPref)  {
	selectedSexualPref.value = newPref;
};

function updateBio (newBio)  {
	bio.value = newBio;
};

function updateInterests (newInterests)  {
	selectedInterests.value = newInterests;
};

// Fonction pour récupérer les informations de profil au chargement de la page
async function fetchProfileData() { 
	try {
		const response = await axios.get("http://localhost:3005/api/after_auth/profil/spec_info", {
			withCredentials: true,
		});
		const data = response.data.result;
		selectedGender.value = data.gender || "";
		selectedSexualPref.value = data.sexual_preference || "";
		bio.value = data.biography || ""; // Renommé ici
		selectedInterests.value = data.interests || [];
	} catch (error) {
		console.error("Error fetching profile data:", error);
		message.value = "Failed to load profile information.";
	}
};

// Charger les données de profil lorsque le composant est monté
onMounted(() => {
	fetchProfileData();
});

// Fonction pour soumettre les modifications
async function submitForm() {
	try {
		const response = await axios.post(
			"http://localhost:3005/api/after_auth/profil/update", // Changez l'URL si nécessaire
			{
				gender: selectedGender.value,
				sexual_preference: selectedSexualPref.value,
				biography: bio.value, // Utilisation de la nouvelle variable
				interests: selectedInterests.value,
			},
			{
				withCredentials: true,
			}
		);
		console.log(response.data);
		message.value = response.data.message;
	} catch (error) {
		console.error("Error submitting profile changes:", error);
		message.value = "Failed to update profile information.";
	}
};
</script>
