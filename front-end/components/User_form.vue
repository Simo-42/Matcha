<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="submitForm" class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <Gender_select :selectedGender="selectedGender" @updateGender="updateGender" />
      <Sexual_pref :selectedSexualPref="selectedSexualPref" @updateSexualPref="updateSexualPref" />
      <Biography_form :SelectedBio="SelectedBio" @updateBio="updateBio" />
      <Interests_select :selectedInterests="selectedInterests" @updateInterests="updateInterests" />
      <button 
        type="submit" 
        class="mt-6 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Soumettre
      </button>
    </form>
  </div>
  <div class="text-center mt-4 text-red-500">{{ message }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Biography_form from '~/components/profil/biography.vue';
import Gender_select from '~/components/profil/gender.vue';
import Sexual_pref from '~/components/profil/sexual_pref.vue';
import Interests_select from '~/components/profil/interests.vue';

const selectedGender = ref('');
const selectedSexualPref = ref('');
const SelectedBio = ref('');
const selectedInterests = ref([]);
const message = ref('');

const updateGender = (newGender) => {
  selectedGender.value = newGender;
};

const updateSexualPref = (newPref) => {
  selectedSexualPref.value = newPref;
};

const updateBio = (newBio) => {
  SelectedBio.value = newBio;
};

const updateInterests = (newInterests) => {
  selectedInterests.value = newInterests;
};

// Fonction pour récupérer les informations de profil au chargement de la page
const fetchProfileData = async () => {
  try {
    const response = await axios.get('http://localhost:3005/api/after_auth/profil/spec_info', {
      withCredentials: true,
    });
    const data = response.data.result;
    selectedGender.value = data.gender || '';
    selectedSexualPref.value = data.sexual_preference || ''; // Vérifiez que le nom correspond à la réponse du backend
    SelectedBio.value = data.biography || '';
    selectedInterests.value = data.interests || [];
  } catch (error) {
    console.error('Error fetching profile data:', error);
    message.value = 'Failed to load profile information.';
  }
};

// Charger les données de profil lorsque le composant est monté
onMounted(() => {
  fetchProfileData();
});

// Fonction pour soumettre les modifications
const submitForm = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3005/api/after_auth/profil/update', // Changez l'URL si nécessaire
      {
        gender: selectedGender.value,
        sexual_pref: selectedSexualPref.value,
        biography: SelectedBio.value,
        interests: selectedInterests.value,
      },
      {
        withCredentials: true,
      }
    );
    message.value = response.data.message;
  } catch (error) {
    console.error('Error submitting profile changes:', error);
    message.value = 'Failed to update profile information.';
  }
};
</script>

<style scoped>
/* Ajoutez ici des styles supplémentaires si nécessaire */
</style>
