<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-8 text-gray-900">Enter Your Date of Birth</h2>
      <form @submit.prevent="submitBirthdate" class="space-y-6">
        <div>
          <label for="birthdate" class="block text-sm font-medium text-gray-700">Date of Birth:</label>
          <input 
            type="date" 
            v-model="birthdate" 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            required 
          />
        </div>
        <div>
          <button 
            type="submit" 
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
      <p v-if="message" class="mt-4 text-center text-sm text-red-600">{{ message }}</p>
    </div>
    <div v-if="showAnimation" class="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-20">
      <LottieAnimation :animationData="animationData" :loop="false" :autoplay="true" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import LottieAnimation from '~/components/lotie/lotie_animation.vue';
import animationData from '~/assets/lottie/valide.json';

const birthdate = ref('');
const message = ref('');
const showAnimation = ref(false);

const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const submitBirthdate = async () => {
  const age = calculateAge(birthdate.value);

  if (age < 18) {
    message.value = 'You must be at least 18 years old.';
    return;
  }
  else if (age > 100) {
    message.value = 'You must be less than 100 years old.';
    return;
  }

  try {
    const response = await axios.post('http://localhost:3005/api/after_auth/profil/update_birthdate', {
      age,
    }, {
      withCredentials: true,
    });

    showAnimation.value = true;
    setTimeout(() => {
      showAnimation.value = false;
    }, 3000);
    navigateTo('/pictures');
  } catch (error) {
    message.value = error.response?.data?.error || 'Failed to update birthdate';
  }
};
</script>
