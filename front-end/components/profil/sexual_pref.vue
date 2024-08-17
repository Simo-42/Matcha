<template>
  <div class="p-4">
    <div>
      <label for="orientation" class="block text-sm font-medium text-gray-700">Select your orientation:</label>
      <!-- lien entre le select et le ref selectedSexualPref  -->
      <select 
        id="orientation"
        v-model="localOrientation"
        @change="emitOrientation"
        class="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-gray-200 text-gray-700"
      > 
        <option v-for="orientation in sex_pref" :key="orientation.value" :value="orientation.value">
          {{ orientation.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  selectedSexualPref: String,
});
const emit = defineEmits(['updateSexualPref']); // Envoie l'orientation au parent

const localOrientation = ref(props.selectedSexualPref || ''); // Initialize with prop or empty string
const sex_pref = [
  { value: 'Heterosexual', label: 'Heterosexual' },
  { value: 'Homosexual', label: 'Homosexual' },
  { value: 'Bisexual-binary', label: 'Bisexual' },
  { value: 'Asexual', label: 'Asexual' },
  { value: 'Pansexual', label: 'Pansexual' },
  { value: 'Queer', label: 'Queer' },
  { value: 'Demisexual', label: 'Demisexual' },
  { value: 'others', label: 'others' }
];

// Le genre sélectionné
const emitOrientation = () => { // Pour mettre à jour l'orientation
  emit('updateSexualPref', localOrientation.value);
};

watch(() => props.selectedSexualPref, (newVal) => {
  if (newVal !== localOrientation.value) {
    localOrientation.value = newVal;
  }
});

</script>
