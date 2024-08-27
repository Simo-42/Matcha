<template>
  <div class="p-4">
    <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Select your gender</label>
    <select 
      id="gender" 
      v-model="localGender" 
      @change="emitGender" 
          class="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-gray-200 text-gray-700"
    >
      <option value="">Sélectionnez le genre</option>
      <option v-for="gender in genders" :key="gender" :value="gender">{{ gender }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch,  } from 'vue';

const props = defineProps({
  selectedGender: String,
});

const emit = defineEmits(['updateGender']);

const localGender = ref(props.selectedGender);
const genders = ['Man', 'Women'];

const emitGender = () => {
  emit('updateGender', localGender.value);
};

watch(() => props.selectedGender, (newVal) => {
  localGender.value = newVal;
});
</script>
