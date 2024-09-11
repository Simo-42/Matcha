<template>
	<div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
			<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form @submit.prevent="authentification" class="space-y-6">
				<div>
					<label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
					<div class="mt-2">
						<input id="username" v-model="username" name="username" type="text" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
						<div class="text-sm">
							<nuxt-link to="/forgot_password" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</nuxt-link>
						</div>
					</div>
					<div class="mt-2">
						<input id="password" v-model="password" name="password" type="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
					</div>
				</div>

				<div>
					<button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
				</div>
			</form>

			<p class="mt-10 text-center text-sm text-gray-500">
				Not a member?
				<nuxt-link to="/register" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">You can register here</nuxt-link>
			</p>

			<p v-if="message" class="mt-2 text-center text-sm text-red-500">
				{{ message }}
			</p>
		</div>
	</div>

	<div v-if="showAnimation" class="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-60">
		<LottieAnimation :animationData="animationData" :loop="false" :autoplay="true" />
	</div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import LottieAnimation from "~/components/lotie/lotie_animation.vue"; // Remplacez par le bon chemin vers votre fichier JSON
import animationData from "~/assets/lottie/valide.json"; // Remplacez par le bon chemin vers votre fichier JSON
const username = ref("");
const password = ref("");
const message = ref("");
const showAnimation = ref(false); // Nouvelle variable pour contrôler l'animation

const authentification = async () => {
	try {
		const response = await axios.post(
			"http://localhost:3005/api/auth/authentification",
			{
				username: username.value,
				password: password.value,
			},
			{
				withCredentials: true,
			}
		);

		// Vérification si le profil est complet

		// Si le profil est complet, redirige vers la page connectée
		if (response.data.profile_complete == true) {
			console.log("Profile is complete");
			showAnimation.value = true; // Déclenche l'animation
			setTimeout(() => {
				navigateTo("/connected");
			}, 2000);
		} else {
			console.log("response.data.profile_complete", response.data.profile_complete);
			console.log("Profile is not complete");
			showAnimation.value = true; // Déclenche l'animation
			setTimeout(() => {
				navigateTo("/after_auth_form");
			}, 2000); // Attendre 2 secondes avant de naviguer pour laisser le temps à l'animation de se jouer
		}
	} catch (error) {
		// Gestion des erreurs d'authentification
		message.value = error.response?.data?.error || "Authentication failed";
	}
};
</script>
