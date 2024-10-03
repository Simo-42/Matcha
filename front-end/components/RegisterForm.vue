<template>
	<div class="flex items-center justify-center min-h-screen bg-gray-100">
		<div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
			<h2 class="text-2xl font-bold text-center mb-8 text-gray-900">Register</h2>
			<form
				@submit.prevent="register"
				class="space-y-6">
				<div>
					<label
						for="email"
						class="block text-sm font-medium text-gray-700"
						>Email:</label
					>
					<input
						type="email"
						v-model="email"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
				</div>
				<div>
					<label
						for="password"
						class="block text-sm font-medium text-gray-700"
						>Password:</label
					>
					<input
						type="password"
						v-model="password"
						maxlength="20"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
					<small
						v-if="password.length > 40"
						class="text-red-500"
						>Password cannot exceed 40 characters.</small
					>
					<small :class="isPasswordComplex ? 'text-green-500' : 'text-red-500'">
						Password must be at least 8 characters long, include an uppercase letter, a number, and a
						special character.
					</small>
				</div>
				<div>
					<label
						for="username"
						class="block text-sm font-medium text-gray-700"
						>Username:</label
					>
					<input
						type="text"
						v-model="username"
						maxlength="20"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
					<small
						v-if="username.length > 20"
						class="text-red-500"
						>Username cannot exceed 20 characters.</small
					>
				</div>
				<div>
					<label
						for="firstname"
						class="block text-sm font-medium text-gray-700"
						>First name:</label
					>
					<input
						type="text"
						v-model="firstname"
						maxlength="30"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
					<small
						v-if="firstname.length > 30"
						class="text-red-500"
						>First name cannot exceed 30 characters.</small
					>
				</div>
				<div>
					<label
						for="lastname"
						class="block text-sm font-medium text-gray-700"
						>Last name:</label
					>
					<input
						type="text"
						v-model="lastname"
						maxlength="30"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
					<small
						v-if="lastname.length > 30"
						class="text-red-500"
						>Last name cannot exceed 30 characters.</small
					>
				</div>
				<div>
					<button
						:disabled="!isFormValid"
						type="submit"
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
						Register
					</button>
				</div>
			</form>
			<p class="mt-10 text-center text-sm text-gray-500">
				<nuxt-link
					to="/auth"
					class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
					>Already register ?</nuxt-link
				>
			</p>
			<p
				v-if="message"
				class="mt-4 text-center text-sm text-green-600">
				{{ message }}
			</p>
		</div>
		<div
			v-if="showAnimation"
			class="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-20">
			<LottieAnimation
				:animationData="animationData"
				:loop="false"
				:autoplay="true" />
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import LottieAnimation from "~/components/lotie/lotie_animation.vue"; // Remplacez par le bon chemin vers votre fichier JSON
import animationData from "~/assets/lottie/email_send.json"; // Remplacez par le bon chemin vers votre fichier JSON

const email = ref("");
const password = ref("");
const username = ref("");
const firstname = ref("");
const lastname = ref("");
const message = ref("");
const showAnimation = ref(false);

const isPasswordComplex = computed(() => {
	const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // regle defini pour le mdp verifie l'integralite de la chaine de char
	return regex.test(password.value);
});

const isFormValid = computed(() => {
	return email.value && username.value && firstname.value && lastname.value && isPasswordComplex.value;
});

async function register() {
	try {
		const response = await axios.post("http://localhost:3005/api/auth/register", {
			email: email.value,
			password: password.value,
			username: username.value,
			firstname: firstname.value,
			lastname: lastname.value,
		});
		message.value = response.data.message;

		showAnimation.value = true;
		setTimeout(() => {
			navigateTo("/auth");
		}, 3000);
	} catch (error) {
		message.value = error.response.data.error || "Registration failed";
	}
}
</script>
