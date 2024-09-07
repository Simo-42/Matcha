<template>
  <div>
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-3xl font-semibold text-gray-800">Visitors</h1>
      <div class="mt-4">
        <VisitorProfileCard :profile="profiles" /> <!-- Par exemple, le premier profil -->
	  </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import VisitorProfileCard from "~/components/profil/example_profil.vue";

const profiles = ref([]);

const fetchProfileData = async () => {
  try {
    const response = await axios.get('http://localhost:3005/api/swipe/get_profile_visitors', {
      withCredentials: true,
    });
    const data = response.data.visitors;

    console.log('Données reçues:', data);

    profiles.value = data.map((profile) => {
      if (typeof profile.interests === 'string') {
        profile.interests = JSON.parse(profile.interests);
      }
      profile.photos = Array.isArray(profile.photos)
        ? profile.photos.map((photo) => photo.replace('/app', ''))
        : [];
      return profile;
    });

    console.log('profiles.value reçues:', profiles.value);
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
