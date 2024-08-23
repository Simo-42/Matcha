<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-8 text-gray-900">Security page</h2>
      <form @submit.prevent="modify_profil" class="space-y-6">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Current Password:</label>
          <input type="password" v-model="password" maxlength="20" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="new_password" class="block text-sm font-medium text-gray-700">New Password :</label>
          <input type="password" v-model="new_password" maxlength="20" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          <small v-if="new_password.length > 20" class="text-red-500">Password cannot exceed 20 characters.</small>
          <small v-if="new_password && !isPasswordComplex" class="text-red-500">
            Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.
          </small>
          <small v-if="new_password && isPasswordComplex" class="text-green-500">
            Password is strong enough.
          </small>
        </div>
        <div>
          <button :disabled="!isFormValid" type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">Modify Password</button>
        </div>
      </form>
      <p v-if="message" class="mt-4 text-center text-sm text-green-600">{{ message }}</p>
    </div>
    <div v-if="showAnimation" class="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-20">
      <LottieAnimation :animationData="animationData" :loop="false" :autoplay="true" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import LottieAnimation from '~/components/lotie/lotie_animation.vue';
import animationData from '~/assets/lottie/valide.json';

const password = ref('');
const new_password = ref('');
const message = ref('');
const showAnimation = ref(false);

const modify_profil = async () => {
  try {
    const response = await axios.post('http://localhost:3005/api/after_auth/profil/change_password', {
      password: password.value,
      new_password: new_password.value,
    }, {
      withCredentials: true,
    });

    message.value = response.data.message;
    showAnimation.value = true;
    setTimeout(() => {
      showAnimation.value = false;
    }, 3000);
  } catch (error) {
    message.value = error.response?.data?.error || 'Modification failed';
  }
};

const isPasswordComplex = computed(() => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(new_password.value);
});

const isFormValid = computed(() => {
  return password.value && new_password.value && isPasswordComplex.value;
});
</script>
