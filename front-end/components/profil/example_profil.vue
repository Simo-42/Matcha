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
			</div>
		</div>
	</div>
</template>

<script setup>
import LottieAnimation from "~/components/lotie/lotie_animation.vue";
import animationData from "~/assets/lottie/MatchFound.json";
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import axios from "axios";
import "swiper/swiper-bundle.css";
import SearchForm from "~/components/swipe/reglage_swipe.vue";

const profiles = ref([]);

const fetchProfileData = async () => {
	try {
		const response = await axios.get("http://localhost:3005/api/swipe/get_profile_visitors", {
			withCredentials: true,
		});
		const data = response.data.visitors;

		profiles.value = data.map((profile) => {
			if (typeof profile.interests === "string") {
				profile.interests = JSON.parse(profile.interests);
			}
			profile.photos = Array.isArray(profile.photos) ? profile.photos.map((photo) => photo.replace("/app", "")) : [];
			return profile;
		});
	} catch (error) {
		console.error("Error fetching profile data:", error);
	}
};

onMounted(() => {
	fetchProfileData();
});
</script>

<style scoped></style>
