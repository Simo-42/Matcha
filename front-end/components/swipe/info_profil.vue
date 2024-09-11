<template>
	<div class="absolute">
		<!-- Icône qui déclenche l'affichage de la bulle d'information -->
		<div class="absolute top-3 left-2 mt-2">
			<Icon @click="openInfoBubble" name="clarity:info-standard-solid" class="text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer" />
		</div>

		<!-- Bulle d'information -->
		<div v-if="isInfoOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
			<div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
				<h2 class="text-2xl font-semibold mb-4 text-gray-900">Informations sur ce profil</h2>
				<p class="mb-4 text-gray-700">Voici quelques informations supplémentaires sur le profil que vous consultez.</p>
				<ul class="list-disc list-inside mb-6 text-gray-700 space-y-2">
					<li><strong>Username :</strong> {{ profile.username }}</li>
					<li><strong>Prénom :</strong> {{ profile.firstname }}</li>
					<li><strong>Âge :</strong> {{ profile.age }}</li>
					<li><strong>Fame Rating :</strong> {{ profile.fame_rating }}</li>
					<li><strong>Genre :</strong> {{ profile.gender }}</li>
					<li>
						<strong>Préférence sexuelle :</strong>
						{{ profile.sexual_preference }}
					</li>
					<li><strong>Localisation :</strong> {{ profile.location }}</li>
					<li><strong>Dernière connexion :</strong> {{ profile.last_seen }}</li>
					<li><strong>Biographie :</strong> {{ profile.biography }}</li>
				</ul>

				<!-- Affichage des intérêts -->
				<div class="mt-4">
					<h3 class="text-lg font-bold text-gray-900">Intérêts</h3>
					<div class="flex flex-wrap mt-2 space-x-2">
						<span v-for="(interest, index) in profile.interests" :key="index" class="bg-indigo-200 text-indigo-800 rounded-full px-3 py-1 text-sm font-medium mb-2">
							{{ interest }}
						</span>
					</div>
				</div>

				<!-- Affichage des photos du profil -->
				<div class="mt-6">
					<Swiper :slides-per-view="1" :loop="true" :pagination="{ clickable: true }" class="relative w-full aspect-w-16 aspect-h-9">
						<SwiperSlide v-for="(photo, photoIndex) in profile.photos.filter((photo) => photo)" :key="photoIndex" class="flex justify-center items-center">
							<div class="w-full h-full">
								<img :src="`http://localhost:3005${photo}`" alt="User Photo" class="w-full h-full object-cover rounded-lg shadow-sm" />
							</div>
						</SwiperSlide>
					</Swiper>
				</div>

				<!-- Boutons de fermeture et quitter -->
				<div class="flex justify-end mt-6 space-x-4">
					<button @click="closeInfoBubble" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors">Fermer</button>
					<button @click="quitProfile" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Quitter</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const props = defineProps({
	profile: {
		type: Object,
		required: true,
	},
});

const isInfoOpen = ref(false);

const openInfoBubble = async () => {
	isInfoOpen.value = true;
	console.log("props.profile._id", props.profile.id);
	await visitedProfiles(props.profile.id);
};

const visitedProfiles = async (visitedUserId) => {
	try {
		await axios.post(
			"http://localhost:3005/api/swipe/set_profile_visited",
			{ userIdTo: visitedUserId }, // Les données envoyées
			{ withCredentials: true } // Options (inclut le cookie/token)
		);
	} catch (error) {
		console.error(error);
	}
	console.log("Profil visité enregistré.");
};

const closeInfoBubble = () => {
	isInfoOpen.value = false;
};

const quitProfile = () => {
	isInfoOpen.value = false;
	console.log("L'utilisateur a quitté le profil.");
	// Tu peux ajouter une redirection ou une action spécifique ici
};
</script>
