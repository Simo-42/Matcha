<template>
  <div class="max-w-sm bg-white border border-gray-500 rounded-lg shadow-md overflow-hidden mx-auto mt-10">
    <Swiper
      :slides-per-view="1"
      :loop="true"
      :pagination="{ clickable: true }"
      class="relative h-96"
    >
      <SwiperSlide v-for="(photo, index) in photos.filter(photo => photo)" :key="index"> 
        <img :src="`http://localhost:3005${photo}`" alt="User Photo" class="w-full h-full object-cover">
      </SwiperSlide>
    </Swiper>

    <div class="p-6">
      <h2 class="text-2xl font-bold text-gray-900">{{ firstname }} {{ lastname }} </h2>
      <h2 class="text-2xl font-bold text-gray-900"> Age :  {{ age }}</h2>
      <span class="text-gray-600 font-medium">My Biography:</span>
      <p class="text-gray-600 mt-4 bg-gray-100 p-4 rounded-lg border border-gray-300">{{ biography }}</p>

      <div class="mt-4">
        <div class="flex items-center">
          <span class="text-gray-600 font-medium">Gender:</span>
          <span class="ml-2 text-gray-800">{{ gender }}</span>
        </div>
        <div class="flex items-center mt-2">
          <span class="text-gray-600 font-medium">Preference:</span>
          <span class="ml-2 text-gray-800">{{ sexual_preference }}</span>
        </div>
        <div class="flex items-center mt-2">
          <span class="text-gray-600 font-medium">Location:</span>
          <span class="ml-2 text-gray-800">{{ location }}</span>
        </div>
      </div>

      <div class="mt-4">
        <h3 class="text-lg font-bold text-gray-900">Interests</h3>
        <div class="flex flex-wrap mt-2">
          <span v-for="(interest, index) in interests" :key="index" class="bg-indigo-200 text-indigo-800 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2">
            {{ interest }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const photos = ref([]); 
const firstname = ref(''); 
const lastname = ref(''); 
const age = ref(''); 
const biography = ref('');
const gender = ref(''); 

const sexual_preference = ref(''); 
const interests = ref([]); 
const location = ref('');

const fetchProfileData = async () => {
  try {
    const response = await axios.get('http://localhost:3005/api/after_auth/profil/my_profil_info', {
      withCredentials: true,
    });

    const data = response.data.result;
    firstname.value = data.firstname;
    lastname.value = data.lastname;
    biography.value = data.biography;
    gender.value = data.gender;
    console.log("La valuer de photos", data.value); // Ligne de débogage pour vérifier les URLs des photos

    photos.value = Array.isArray(data.photos)
      ? data.photos.map(photo => photo.replace('/app', ''))
      : [];
    age.value = data.age;
    sexual_preference.value = data.sexual_preference;
    location.value = data.location;
    interests.value = Array.isArray(data.interests) ? data.interests : JSON.parse(data.interests);

    console.log("La valuer de photos", photos.value); // Ligne de débogage pour vérifier les URLs des photos

  } catch (error) {
    console.error('Error fetching profile data:', error);
  }
};


onMounted(() => {
  fetchProfileData();
});
</script>

<style scoped>
/* Ajoutez ici des styles supplémentaires si nécessaire */
</style>
