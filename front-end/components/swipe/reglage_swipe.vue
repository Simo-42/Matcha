<template>
	<div class="relative max-w-sm mx-auto p-2">
		<!-- Icône de réglage -->
		<div class="flex justify-end mb-4">
			<button @click="toggleSettings" class="p-2">
				<img src="/img/reglages.png" alt="Settings" class="w-6 h-6" />
			</button>
		</div>

		<!-- Formulaire de critères de recherche, caché par défaut -->
		<div v-if="showSettings" class="bg-white p-4 rounded-lg shadow-md">
			<!-- Carousel pour les intérêts -->
			<div class="mb-3">
				<h3 class="text-md font-semibold">Select Interests</h3>
				<Interests_select :selectedInterests="selectedInterests" @updateInterests="updateInterests" />
			</div>

			<!-- Curseur d'écart d'âge -->
			<div class="mb-3">
				<h3 class="text-md font-semibold">Select Age Range</h3>
				<div class="flex space-x-2 items-center">
					<input type="number" v-model.number="age_min" min="18" max="100" placeholder="Min age" class="w-1/2 p-2 border rounded" />
					<span>-</span>
					<input type="number" v-model.number="age_max" min="18" max="100" placeholder="Max age" class="w-1/2 p-2 border rounded" />
				</div>
				<p v-if="age_min > age_max" class="text-red-500 text-sm mt-2">Minimum age must be less than maximum age.</p>
			</div>

			<!-- Sélecteur d'écart de "fame rating" -->
			<div class="mb-3">
				<h3 class="text-md font-semibold">Select Fame Rating Gap</h3>
				<select v-model="fame_rating_gap" class="w-full p-2 border rounded text-sm">
					<option value="">Select Fame Rating Gap</option>
					<option value="1-10">1-10</option>
					<option value="10-30">10-30</option>
					<option value="30-50">30-50</option>
					<option value="50-100">50-100</option>
				</select>
			</div>

			<!-- Formulaire pour la localisation -->
			<div class="mb-3">
				<h3 class="text-md font-semibold">Select a city</h3>
				<select v-model="location_gap" class="w-full p-2 border rounded text-sm">
					<option value="">Select your city</option>
					<option value="Paris">Paris</option>
					<option value="London">London</option>
					<option value="Toronto">Toronto</option>
					<option value="Casablanca">Casablanca</option>
				</select>
			</div>

			<!-- Bouton de soumission -->
			<div class="text-center">
				<button @click="submitForm" class="bg-blue-500 text-white px-3 py-2 rounded text-sm">Start Search</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import Interests_select from "~/components/profil/interests.vue";

const emit = defineEmits(["submitForm"]); // Utilise defineEmits pour déclarer l'événement

const selectedInterests = ref([]); // Déclare selectedInterests ici
const age_min = ref("");
const age_max = ref("");
const location_gap = ref("");
const fame_rating_gap = ref("");
const showSettings = ref(false);

const updateInterests = (newInterests) => {
	selectedInterests.value = newInterests;
};

const toggleSettings = () => {
	showSettings.value = !showSettings.value;
};

const submitForm = () => {
	const searchCriteria = {
		interests: selectedInterests.value,
		age_gap: `${age_min.value}-${age_max.value}`,
		location_gap: location_gap.value,
		fame_rating_gap: fame_rating_gap.value,
	};
	emit("submitForm", searchCriteria);
};
</script>

<style scoped>
/* Styles personnalisés pour ajuster l'apparence */
</style>
