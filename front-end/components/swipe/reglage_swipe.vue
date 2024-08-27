<template>
  
  <div class="relative max-w-sm mx-auto p-2">
    <!-- Icône de réglage -->
    <div class="flex justify-end mb-4">
      <button @click="toggleSettings" class="p-2">
        <img src="/img/reglages.png" alt="Settings" class="w-6 h-6" />
      </button>
    </div>

    <!-- Formulaire de critères de recherche, caché par défaut -->
    <div v-if="showSettings" class="bg-white p-4 rounded-lg shadow-md">
      <!-- Carousel pour les intérêts -->
      <div class="mb-3">
        <h3 class="text-md font-semibold">Select Interests</h3>
        <Interests_select @update="updateInterests" />
      </div>

      <!-- Curseur d'écart d'âge -->
<div class="mb-3">
  <h3 class="text-md font-semibold">Select Age Range</h3>
  <div class="flex space-x-2 items-center">
    <input 
      type="number" 
      v-model.number="age_min" 
      min="18" 
      max="100" 
      placeholder="Min age" 
      class="w-1/2 p-2 border rounded"
    />
    <span>-</span>
    <input 
      type="number" 
      v-model.number="age_max" 
      min="18" 
      max="100" 
      placeholder="Max age" 
      class="w-1/2 p-2 border rounded"
    />
  </div>
  <p v-if="age_min > age_max" class="text-red-500 text-sm mt-2">Minimum age must be less than maximum age.</p>

</div>
      <!-- Sélecteur d'écart de "fame rating" -->
      <div class="mb-3">
        <h3 class="text-md font-semibold">Select Fame Rating Gap</h3>
        <select v-model="fame_rating_gap" class="w-full p-2 border rounded text-sm">
          <option value="">Select Fame Rating Gap</option>
          <option value="1-3">1-3</option>
          <option value="4-6">4-6</option>
          <option value="7-9">7-9</option>
          <option value="10">10</option>
        </select>
      </div>

      <!-- Formulaire pour la localisation -->
      <div class="mb-3">
        <h3 class="text-md font-semibold">Enter Your Location</h3>
        <input 
          v-model="location" 
          type="text" 
          placeholder="Enter your location" 
          class="w-full p-2 border rounded text-sm"
        />
      </div>

      <!-- Bouton de soumission -->
      <div class="text-center">
        <button @click="submitForm" class="bg-blue-500 text-white px-3 py-2 rounded text-sm">Start Search</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import Interests_select from '~/components/profil/interests.vue';
import reglage_swipe from '~/components/swipe/reglage_swipe.vue';

const selectedInterests = ref([]);
const age_min = ref('');
const age_max = ref('');
const location = ref('');
const fame_rating_gap = ref('');
const showSettings = ref(false);

const updateInterests = (newInterests) => {
  selectedInterests.value = newInterests;
};

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

const submitForm = () => {
  const searchCriteria = {
    interests: selectedInterests.value,
    age_gap: `${age_gap_min.value}-${age_gap_max.value}`,
    location: location.value,
    fame_rating_gap: fame_rating_gap.value,
  };

  console.log('Search Criteria:', searchCriteria);
};
</script>
<style scoped>
/* Styles personnalisés pour ajuster l'apparence */
</style>