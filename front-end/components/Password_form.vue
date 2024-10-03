<template>
	<div class="flex items-center justify-center min-h-screen bg-gray-100">
		<div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
			<h2 class="text-2xl font-bold text-center mb-8 text-gray-900">Reset Password</h2>
			<form
				@submit.prevent="resetPassword"
				class="space-y-6">
				<div>
					<label
						for="password"
						class="block text-sm font-medium text-gray-700"
						>New Password:</label
					>
					<input
						type="password"
						v-model="newPassword"
						maxlength="20"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
					<small :class="isPasswordComplex ? 'text-green-500' : 'text-red-500'">
						Password must be at least 8 characters long, include an uppercase letter, a number, and a
						special character.
					</small>
				</div>
				<button
					type="submit"
					class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					Reset Password
				</button>
			</form>
			<p class="mt-10 text-center text-sm text-gray-500">
				<nuxt-link
					to="/auth"
					class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
					>Comeback to authentification ?</nuxt-link
				>
			</p>
			<p
				v-if="message"
				class="mt-4 text-center text-sm text-green-600">
				{{ message }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const newPassword = ref("");
const message = ref("");

const isPasswordComplex = computed(() => {
	const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	return regex.test(newPassword.value);
});

async function resetPassword() {
	const resetToken = route.params.token; // Récupère le token depuis l'URL
	console.log("je suis ici");
	try {
		const response = await axios.post(`http://localhost:3005/api/password/reset/${resetToken}`, {
			newPassword: newPassword.value,
		});
		message.value = response.data.message; // Met à jour le message de succès
		setTimeout(() => {
			router.push("/auth"); // Redirige vers la page de connexion après 3 secondes
		}, 3000);
	} catch (error) {
		message.value = error.response.data.error || "Password reset failed";
	}
}
</script>

<style scoped>
html,
body {
	height: 100%;
	background-color: white;
}
</style>
