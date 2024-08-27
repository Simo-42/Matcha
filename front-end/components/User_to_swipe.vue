<template>
  <div class="max-w-sm bg-white border border-gray-500 rounded-lg shadow-md overflow-hidden mx-auto mt-10">
    <Swiper
      :slides-per-view="1"
      :loop="true"
      :pagination="{ clickable: true }"
      class="relative h-96"
    >
      <!-- Parcours des profils à swiper -->
      <SwiperSlide v-for="(profile, index) in profiles" :key="index"> 
        <div>
          <img v-if="profile.photos && profile.photos.length > 0" :src="profile.photos[0]" alt="Profile Picture" class="w-full h-full object-cover">
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ profile.firstname }} {{ profile.lastname }}</h2>
            <p class="text-gray-600 mt-4 bg-gray-100 p-4 rounded-lg border border-gray-300">{{ profile.biography }}</p>
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
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const profiles = ref([]); // Liste des profils récupérés

// Fonction pour récupérer les profils
const fetchProfileData = async () => {
  try {
    console.log("Je suis là");
    const profil_to_match = await axios.get('http://localhost:3005/api/swipe/profil_to_match', {
      withCredentials: true,
    });

    console.log("Données reçues:", profil_to_match.data);
    profiles.value = profil_to_match.data.profiles; // Assurez-vous que `profiles` est bien dans `data`
    console.log("profiles.value", profiles.value);
  } catch (error) {
    console.error('Error fetching profiles:', error);
  }
};


onMounted(() => {
  fetchProfileData();
});
</script>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>
