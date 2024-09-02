<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-6 overflow-hidden">
		<!-- Photo principale -->
		<div
			@click="selectImage(0)"
			class="relative w-48 h-64 bg-white border-2 border-gray-300 flex items-center justify-center rounded-md shadow-lg cursor-pointer transform transition duration-300 hover:scale-110 hover:shadow-2xl mb-6"
		>
			<div v-if="images[0]" class="relative w-full h-full overflow-hidden rounded-md transform transition duration-300 hover:scale-125">
				<img :src="images[0].src" alt="Photo principale" class="w-full h-full object-cover" />
				<button @click.stop="deleteImage(0)" class="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">Delete</button>
			</div>
			<div v-else class="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-md">
				<span class="text-gray-500 text-3xl font-bold">+</span>
			</div>
			<div class="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">Photo Principale</div>
		</div>

		<!-- Photos secondaires -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
			<div
				v-for="(image, index) in images.slice(1)" 
				:key="index"
				@click="selectImage(index + 1)"
				class="relative w-48 h-64 bg-white border-2 border-gray-300 flex items-center justify-center rounded-md shadow-lg cursor-pointer transform transition duration-300 hover:scale-110 hover:shadow-2xl"
			>
				<div v-if="image" class="relative w-full h-full overflow-hidden rounded-md transform transition duration-300 hover:scale-125">
					<img :src="image.src" alt="Photo secondaire" class="w-full h-full object-cover" />
					<button @click.stop="deleteImage(index + 1)" class="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">Delete</button>
				</div>
				<div v-else class="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-md">
					<span class="text-gray-500 text-xl font-bold">+</span>
				</div>
			</div>
		</div>

		<!-- Indication "At least 2 photos" -->
		<div v-if="images.filter(img => img !== null).length < 2" class="mb-6 text-sm text-gray-500">
			At least 2 photos required
		</div>

		<!-- Bouton Submit -->
		<button
			@click="submitImages"
			class="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition"
			:disabled="images.filter(img => img !== null).length < 2"
		>
			Submit
		</button>
	<p> {{ error }} </p>
	<p> {{ message }} </p>
	</div>

</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const images = ref(Array(5).fill(null)); // Tableau pour stocker les images et leurs URLs
const message = ref(''); // Message de confirmation
const error = ref(''); // Message d'erreur
const selectImage = (index) => {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/*';
	input.onchange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const imageSrc = e.target.result;
				if (images.value.some(img => img && img.src === imageSrc)) {
					alert('This image is already added.');
					return;
				}
				images.value[index] = { file, src: imageSrc }; // Stocke le fichier et son URL pour prévisualisation
			};
			reader.readAsDataURL(file);
		}
	};
	input.click();
};

const deleteImage = (index) => {
	if (images.value[index]) {
		URL.revokeObjectURL(images.value[index]?.src); // Libère la mémoire utilisée par l'URL
	}
	images.value[index] = null;
};

const submitImages = async () => {
	if (images.value[0] === null) {
		alert('You must select a main photo before submitting.');
		return;
	} else if (images.value.filter((img) => img !== null).length < 2) {
		alert('You must select at least 2 photos before submitting.');
		return;
	}
	try {
		const formData = new FormData();
		images.value.forEach((image) => {
			if (image) {
				formData.append('pictures', image.file); // Ajoute uniquement le fichier à formData
			}
		});

		const response = await axios.post(
			'http://localhost:3005/api/upload/pictures',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true,
			}
		);
		message.value = response.data.message;
		navigateTo('/gps');
	} catch (error) {
		error.value = 'An error occurred while submitting the images.';
	}
};
</script>

<style scoped>
html, body {
	overflow: hidden; /* Empêche le défilement de la page */
}
</style>
