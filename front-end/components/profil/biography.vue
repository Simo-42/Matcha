<template>
	<div class="p-4">
		<label for="bio" class="block text-sm font-medium text-gray-700">Your Biography</label>
		<textarea id="bio" v-model="localBio" :maxlength="maxLength" rows="6" placeholder="Write about yourself..." class="mt-2 block w-full p-3 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-gray-100 text-gray-700 resize-none"></textarea>
		<p class="mt-2 text-sm text-gray-500">{{ remainingChars }} characters left</p>
	</div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
	bio: {
		type: String,
		default: "",
	},
});

const localBio = ref(props.bio || ""); // Initialisation directe

const maxLength = 100;

const remainingChars = computed(() => {
	return maxLength - localBio.value.length;
});

const emit = defineEmits(["updateBio"]);

watch(
	() => props.bio,
	(newVal) => {
		if (newVal !== localBio.value) {
			localBio.value = newVal || "";
		}
	}
);

// Émission des changements de localBio
watch(localBio, () => {
	emit("updateBio", localBio.value);
});
</script>
