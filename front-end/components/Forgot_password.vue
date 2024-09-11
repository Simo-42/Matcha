<template>
	<div class="flex items-center justify-center min-h-screen bg-gray-100">
		<div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
			<h2 class="text-2xl font-bold text-center mb-8 text-gray-900">Forget Password</h2>
			<form @submit.prevent="passwordForget" class="space-y-6">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
					<input type="email" v-model="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
				</div>
				<div>
					<button :disabled="!isFormValid" type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
				</div>
			</form>
			<p class="mt-10 text-center text-sm text-gray-500">
				<nuxt-link to="/auth" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Comeback to authentification ?</nuxt-link>
			</p>
			<p v-if="message" class="mt-4 text-center text-sm text-green-600">
				{{ message }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const email = ref("");
const message = ref("");

const isFormValid = computed(() => {
	return email.value;
});

const passwordForget = async () => {
	try {
		const response = await axios.post("http://localhost:3005/api/password/forgot_password", {
			email: email.value,
		});
		message.value = response.data.message;
	} catch (error) {
		message.value = error.response.data.error || "Password reset failed";
	}
};
</script>
