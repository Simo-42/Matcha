<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="submitForm" class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <GenderSelect :selectedGender="selectedGender" @updateGender="updateGender" />
      <SexualPreferenceSelect :selectedSexualPref="selectedSexualPref" @updateSexualPref="updateSexualPref" />
      <Biography :SelectedBio="SelectedBio" @updateBio="updateBio" />
      <Interests :selectedInterests="selectedInterests" @updateInterests="updateInterests" />
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
import { ref } from 'vue';
import GenderSelect from '~/components/profil/gender.vue';
import SexualPreferenceSelect from '~/components/profil/sexual_pref.vue';
import Biography from '~/components/profil/biography.vue';
import Interests from '~/components/profil/interests.vue';
import axios from 'axios';

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

const submitForm = async () => {  
  try {
    const response = await axios.post('http://localhost:3005/api/after_auth/register', 
    {
      gender: selectedGender.value,
      sex_pref: selectedSexualPref.value,
      biography: SelectedBio.value,
      interests: JSON.stringify(selectedInterests.value),  // Conversion en JSON
    }, 
    {
      withCredentials: true, // Ultra important pour que les cookies soient envoyés
    });
    
    console.log("im here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    message.value = response.data.message;
  } catch (error) {
    message.value = error.response?.data?.error || 'Authentication failed';
  }
};

</script>
