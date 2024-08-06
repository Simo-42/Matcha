<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-8 text-gray-900">Register</h2>
      <form @submit.prevent="register" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
          <input type="email" v-model="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input type="password" v-model="password" maxlength="20" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          <small v-if="password.length > 20" class="text-red-500">Password cannot exceed 20 characters.</small>
        </div>
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
          <input type="text" v-model="username" maxlength="20" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          <small v-if="username.length > 20" class="text-red-500">Username cannot exceed 20 characters.</small>
        </div>
        <div>
          <label for="firstname" class="block text-sm font-medium text-gray-700">First name:</label>
          <input type="text" v-model="firstname" maxlength="30" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          <small v-if="firstname.length > 30" class="text-red-500">First name cannot exceed 30 characters.</small>
        </div>
        <div>
          <label for="lastname" class="block text-sm font-medium text-gray-700">Last name:</label>
          <input type="text" v-model="lastname" maxlength="30" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          <small v-if="lastname.length > 30" class="text-red-500">Last name cannot exceed 30 characters.</small>
        </div>
        <div>
          <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Register</button>
        </div>
      </form>
      <p v-if="message" class="mt-4 text-center text-sm text-green-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const password = ref('');
const username = ref('');
const firstname = ref('');
const lastname = ref('');
const message = ref('');

const register = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      email: email.value,
      password: password.value,
      username: username.value,
      firstname: firstname.value,
      lastname: lastname.value
    });
    message.value = response.data.message;
  } catch (error) {
    message.value = error.response.data.error || 'Registration failed';
  }
};
</script>
