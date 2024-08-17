<template>
  <div class="p-4">
    <label for="interests" class="block text-sm font-medium text-gray-700">Select your interests 10 max:</label>
    <div class="mt-2">
      <!-- Boucle pour afficher les choix prédéfinis -->
      <div 
        v-for="choice in choices" 
        :key="choice"
        @click="toggleSelection(choice)"
        :class="{
          'bg-blue-500 text-white': selectedTags.includes(choice),
          'bg-gray-200 text-gray-700': !selectedTags.includes(choice)
        }"
        class="cursor-pointer inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
      >
        {{ choice }}
      </div>
      
      <!-- Input pour ajouter un nouvel intérêt -->
      <input
        v-model="newTag"
        @keyup.enter="addTag"
        placeholder="Add a tag"
        class="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
      />
    </div>

    <!-- Affichage des tags sélectionnés -->
    <div class="mt-4">
      <h3 class="block text-sm font-medium text-gray-700">Selected Interests:</h3>
      <div v-if="selectedTags.length === 0" class="text-sm text-gray-500">No interests selected.</div>
      <div v-else>
        <div 
          v-for="tag in selectedTags" 
          :key="tag"
          class="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
        >
          {{ tag }}
          <button @click="removeTag(tag)" class="ml-1 text-red-500">x</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  selectedInterests: {
    type: Array,
    default: () => []
  }
});

const choices = ref([
  '#vegan', '#geek', '#piercing', '#sports', '#music', '#art', 
  '#league of legends', '#E-sport', '#MonkeyType', '#Nuxt3Js'
]);

const selectedTags = ref(props.selectedInterests || []);
const newTag = ref('');

const toggleSelection = (choice) => {
  if (selectedTags.value.includes(choice)) {
    selectedTags.value = selectedTags.value.filter(tag => tag !== choice);
  } else {
    selectedTags.value.push(choice);
  }
};

const addTag = () => {
  if (selectedTags.value.length >= 10) {
    return;
  }
  let tag = newTag.value.trim();
  if (tag && !tag.startsWith('#')) {
    tag = `#${tag}`;
  }
  if (tag && !selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
  }
  newTag.value = '';  // Réinitialiser le champ après ajout
};

const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag);
};

const emit = defineEmits(['updateInterests']);

const emitInterests = () => {
  emit('updateInterests', selectedTags.value);
};

watch(() => props.selectedInterests, (newVal) => {
  selectedTags.value = newVal || [];
});

watch(selectedTags, () => {
  emitInterests();
});
</script>
