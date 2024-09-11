<template>
	<div class="flex items-center justify-center min-h-screen bg-gray-100">
		<div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
			<h2 class="text-2xl font-bold text-center mb-8 text-gray-900">Modify your personal information</h2>
			<form @submit.prevent="modify_profil" class="space-y-6">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
					<input type="email" v-model="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
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
					<label for="password" class="block text-sm font-medium text-gray-700">Current Password:</label>
					<input type="password" v-model="password" maxlength="20" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
				</div>
				<div>
					<label for="new_password" class="block text-sm font-medium text-gray-700">New Password (optional):</label>
					<input type="password" v-model="verify_password" maxlength="20" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
					<small v-if="verify_password.length > 20" class="text-red-500">Password cannot exceed 20 characters.</small>
					<small v-if="verify_password && !isPasswordComplex" class="text-red-500"> Password must be at least 8 characters long, include an uppercase letter, a number, and a special character. </small>
					<small v-if="verify_password && isPasswordComplex" class="text-green-500"> Password is strong enough. </small>
				</div>
				<div>
					<button :disabled="!isFormValid" type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">Modify Profile</button>
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
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import LottieAnimation from "~/components/lotie/lotie_animation.vue"; // Remplacez par le bon chemin vers votre fichier JSON
import animationData from "~/assets/lottie/valide.json"; // Remplacez par le bon chemin vers votre fichier JSON

const email = ref("");
const password = ref("");
const verify_password = ref("");
const username = ref("");
const firstname = ref("");
const lastname = ref("");
const message = ref("");
const showAnimation = ref(false);

const fetchProfileData = async () => {
	try {
		const response = await axios.get("http://localhost:3005/api/after_auth/profil/id_info", {
			withCredentials: true,
		});
		const data = response.data.result;
		email.value = data.email || "";
		username.value = data.username || "";
		firstname.value = data.firstname || "";
		lastname.value = data.lastname || "";
	} catch (error) {
		console.error("Error fetching profile data:", error);
		message.value = "Failed to load profile information.";
	}
};

onMounted(() => {
	fetchProfileData();
});
// si le user change son email doit reverifier son compte
const modify_profil = async () => {
	try {
		const response = await axios.post(
			"http://localhost:3005/api/after_auth/profil/update_profil",
			{
				email: email.value,
				username: username.value,
				firstname: firstname.value,
				lastname: lastname.value,
			},
			{
				withCredentials: true,
			}
		);

		message.value = response.data.message;
		showAnimation.value = true;
		setTimeout(() => {
			showAnimation.value = false; // Cache l'animation après 3 secondes
		}, 3000);
	} catch (error) {
		message.value = error.response?.data?.error || "Modification failed";
	}
};

const isPasswordComplex = computed(() => {
	const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Regle définie pour le mdp vérifie l'intégralité de la chaîne de caractères
	return regex.test(password.value);
});

const isFormValid = computed(() => {
	return email.value !== "" && username.value !== "" && firstname.value !== "" && lastname.value !== "" && (verify_password.value === "" || isPasswordComplex.value);
});
</script>
