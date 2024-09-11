<template>
	<div class="w-full max-w-2xl mx-auto mt-10">
		<!-- Carte et bouton SearchForm -->
		<div class="relative flex items-center">
			<!-- Stack de cartes de profils -->
			<div class="card-stack relative w-3/4">
				<div v-for="(profile, index) in profiles" :key="profile.id" :class="['card', { 'top-card': index === profiles.length - 1 }]">
					<div class="card-content bg-white border border-gray-900 rounded-lg shadow-md overflow-hidden">
						<Swiper :slides-per-view="1" :loop="true" :pagination="{ clickable: true }" :initial-slide="0" class="relative w-full aspect-w-16 aspect-h-9">
							<!-- Affichage des photos du profil -->
							<SwiperSlide v-for="(photo, photoIndex) in profile.photos.filter((photo) => photo)" :key="photoIndex" class="flex justify-center items-center">
								<div class="w-full h-full">
									<img :src="`http://localhost:3005${photo}`" alt="User Photo" class="w-full h-full object-cover" />
								</div>
							</SwiperSlide>
						</Swiper>
						<div class="p-6">
							<h2 class="text-3xl font-bold text-gray-900">{{ profile.firstname }} {{ profile.lastname }} {{ profile.age }}</h2>
							<p class="text-gray-600 mt-4 bg-gray-100 p-4 rounded-lg border border-gray-300">
								{{ profile.biography }}
							</p>
							<div class="mt-4">
								<div class="flex items-center">
									<span class="text-gray-600 font-medium">Gender:</span>
									<span class="ml-2 text-gray-800">{{ profile.gender }}</span>
								</div>
								<div class="flex items-center mt-2">
									<span class="text-gray-600 font-medium">Preference:</span>
									<span class="ml-2 text-gray-800">{{ profile.sexual_preference }}</span>
								</div>
								<div class="flex items-center mt-2">
									<span class="text-gray-600 font-medium">Location:</span>
									<span class="ml-2 text-gray-800">{{ profile.location }}</span>
								</div>
							</div>
							<div class="mt-4">
								<h3 class="text-lg font-bold text-gray-900">Interests</h3>
								<div class="flex flex-wrap mt-2">
									<span v-for="(interest, index) in profile.interests" :key="index" class="bg-indigo-200 text-indigo-800 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2">
										{{ interest }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Boutons like/dislike en bas de la carte -->
				<div class="tinder--buttons flex justify-around mt-4 w-full max-w-md mx-auto">
					<button @click="swipeLeft" class="w-16 h-16 bg-red-500 rounded-full shadow-lg flex items-center justify-center text-2xl text-white">
						<i class="fas fa-times"></i>
					</button>
					<button @click="swipeRight" class="w-16 h-16 bg-green-500 rounded-full shadow-lg flex items-center justify-center text-2xl text-white">
						<i class="fas fa-heart"></i>
					</button>
				</div>
			</div>

			<!-- SearchForm Positionné à droite -->
			<div class="absolute top-0 right-20 mt-2 mr-2">
				<SearchForm @submitForm="handleSearchCriteria" />
				<info :profile="profiles.length ? profiles[profiles.length - 1] : {}" />
				<!-- Check si le profil n'est pas vide avant d'essayer de l'ouvir -->
			</div>
			<signaler @report="handleReport" />
		</div>

		<!-- Animation de match -->
		<div v-if="showAnimation" class="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-20">
			<LottieAnimation :animationData="animationData" :loop="false" :autoplay="true" />
		</div>
	</div>
</template>

<script setup>
// 1 - Etape 1 : Avoir tout les profils que le profil pourrait potentiellement match
// 2 - Etape 2 : Avoir les profils que le profil a déjà match les exclure de la liste
// 3 - Etape 3 : Avoir les profils que le profil a déjà swipé les exclure de la liste
// 4 - Etape 4 : Trier les profils en fonctions des préférences du profil fame rating / distance / interets en commun
// 5 - Etape 5 : Trier pour montrer les profils les plus proches en premier
// 6 - Etape 6 : Le user peut selectioner des criteres Age
import LottieAnimation from "~/components/lotie/lotie_animation.vue"; // Remplacez par le bon chemin vers votre fichier JSON
import animationData from "~/assets/lottie/MatchFound.json"; // Remplacez par le bon chemin vers votre fichier JSON
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import axios from "axios";
import signaler from "~/components/swipe/signaler.vue";
import info from "~/components/swipe/info_profil.vue";

import "swiper/swiper-bundle.css";
import SearchForm from "~/components/swipe/reglage_swipe.vue";
const profiles = ref([]); // Liste des profils récupérés
const profilesMatched = ref([]); // Liste des profils déjà matchés
const searchCriteria = ref({}); // Critères de recherche
const showAnimation = ref(false); // Nouvelle variable pour contrôler l'animation
const isSidebarOpen = ref(false);
const hasReported = ref(false);

const likeProfile = async (likedUserId, status) => {
	try {
		const response = await axios.post(
			"http://localhost:3005/api/swipe/like_profil",
			{
				likedUserId,
				status,
			},
			{
				withCredentials: true,
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error liking/disliking profile:", error);
	}
};

const swipeLeft = async () => {
	if (isSwiping || profiles.value.length === 0) return;
	isSwiping = true; //
	const profile_id = profiles.value[profiles.value.length - 1].id;
	await likeProfile(profile_id, "dislike");
	profiles.value.pop(); // Supprime la carte du haut
	isSwiping = false;
};

let isSwiping = false;

const swipeRight = async () => {
	if (isSwiping || profiles.value.length === 0) return;
	isSwiping = true;

	const profile_id = profiles.value[profiles.value.length - 1].id;
	const response = await likeProfile(profile_id, "like");

	if (response.match === true) {
		showAnimation.value = true; // Déclenche l'animation
		setTimeout(() => {
			showAnimation.value = false; // Cache l'animation après 3 secondes
		}, 3000);
		console.log("Matched");
	}

	profiles.value.pop(); // Supprime la carte du haut
	isSwiping = false;
};

const fetchProfileData = async () => {
	try {
		console.log("Je suis là");
		console.log("Search criteria:", searchCriteria.value);
		const response = await axios.get("http://localhost:3005/api/swipe/profil_to_match", {
			params: searchCriteria.value,
			withCredentials: true,
		});

		const { data } = response;
		console.log("Données reçues:", data);
		profiles.value = data.profiles.map((profile) => {
			if (typeof profile.interests === "string") {
				profile.interests = JSON.parse(profile.interests);
			}
			profile.photos = Array.isArray(profile.photos) ? profile.photos.map((photo) => photo.replace("/app", "")) : []; // Supprime app dans toutes les URL des photos
			return profile;
		});
	} catch (error) {
		console.error("Error fetching profiles:", error);
	}
};

const handleReport = async () => {
	hasReported.value = true;
	const profile_id = profiles.value[profiles.value.length - 1].id;
	console.log("Name of the profile to report:", profiles.value[profiles.value.length - 1].firstname);
	await likeProfile(profile_id, "dislike");
	profiles.value.pop();
	setTimeout(() => {
		hasReported.value = false;
	}, 1000);

	try {
		const response = await axios.post(
			"http://localhost:3005/api/swipe/report_fake_profil",
			{
				profile_id,
			},
			{
				withCredentials: true,
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error reporting profile:", error);
	}
};

const handleSearchCriteria = (criteria) => {
	searchCriteria.value = criteria;
	localStorage.setItem("searchCriteria", JSON.stringify(criteria));

	console.log("Search criteria received from child:", criteria);
	window.location.reload();
};

onMounted(() => {
	const savedCriteria = localStorage.getItem("searchCriteria");

	if (savedCriteria) {
		searchCriteria.value = JSON.parse(savedCriteria);
		console.log("Restored search criteria:", searchCriteria.value);
	}
	console.log("Search form component:", searchCriteria.interests);
	fetchProfileData();
});
</script>

<style scoped>
.card-stack {
	perspective: 1000px;
}

.card {
	position: absolute;
	width: 100%;
	transform-origin: bottom center;
	transition: transform 0.5s ease-out, opacity 0.5s ease-out;
	backface-visibility: hidden;
}

.card.top-card {
	z-index: 10;
}

.card:not(.top-card) {
	transform: scale(0.9) translateY(20px);
}

.card.top-card.swiping {
	opacity: 0;
	transform: rotate(15deg) translateX(300px) translateY(-50px);
}

.card.top-card.swiping-left {
	opacity: 0;
	transform: rotate(-15deg) translateX(-300px) translateY(-50px);
}

.tinder--buttons {
	position: relative;
	z-index: 10;
	margin-top: 20px; /* Espacement par rapport à la carte */
	display: flex;
	justify-content: center; /* Centrer les boutons horizontalement */
}
.sidebar {
	position: fixed;
	top: 0;
	right: -100%; /* Le panneau est initialement hors de la vue */
	width: 300px; /* Largeur du panneau */
	height: 100%;
	background-color: white;
	z-index: 50; /* Assure que le panneau est au-dessus du contenu */
	transition: right 0.3s ease; /* Effet de transition lors de l'ouverture et de la fermeture */
	box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5); /* Ombre pour l'effet de profondeur */
}

.sidebar.open {
	right: 0; /* Le panneau est visible lorsqu'il est ouvert */
}
</style>
