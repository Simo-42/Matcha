<!-- ChildComponent.vue -->
<template>
	<div class="relative">
		<!-- Icône qui déclenche la confirmation -->
		<div class="absolute top-3 left-2 mt-2">
			<Icon
				@click="openConfirmation"
				name="clarity:warning-standard-solid"
				class="text-3xl text-gray-700 hover:text-gray-900 transition-colors" />
		</div>

		<!-- Modal de confirmation -->
		<div
			v-if="isConfirmationOpen"
			class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
				<h2 class="text-xl font-semibold mb-4">Souhaitez-vous vraiment signaler cet individu ?</h2>
				<p class="mb-4 text-gray-700">Cette action est irréversible.</p>
				<div class="flex justify-end">
					<button
						@click="confirmAction"
						class="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700 transition-colors">
						Oui, signaler
					</button>
					<button
						@click="closeConfirmation"
						class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors">
						Annuler
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";

const isConfirmationOpen = ref(false);
const emit = defineEmits(["report"]);

const openConfirmation = () => {
	isConfirmationOpen.value = true;
};

const closeConfirmation = () => {
	isConfirmationOpen.value = false;
};

const confirmAction = () => {
	emit("report");
	closeConfirmation();
};
</script>

<style scoped>
/* Ajout de styles si besoin */
</style>
