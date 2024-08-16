<template>
  <div class="p-4">
    <label for="SelectedBio" class="block text-sm font-medium text-gray-700">Your Biography</label>
    <textarea
      id="SelectedBio"
      v-model="Localbio"
      :maxlength="maxLength"
      rows="6"
      placeholder="Write about yourself..."
      class="mt-2 block w-full p-3 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-gray-100 text-gray-700 resize-none"
    ></textarea>
    <p class="mt-2 text-sm text-gray-500">{{ remainingChars }} characters left</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits, defineProps } from 'vue';

const props = defineProps({
  Bio: {
    type: String,
    default: ''
  }
});

const maxLength = 100;


const Localbio = ref(props.Bio || '');

const remainingChars = computed(() => {
  return maxLength - (Localbio.value ? Localbio.value.length : 0);
});

const emit = defineEmits(['updateBio']);

const emitBio = () => {
  emit('updateBio', Localbio.value);
};

watch(() => props.Bio, (newVal) => {
  Localbio.value = newVal || '';
});

// Watch Localbio and emit changes to the parent
watch(Localbio, () => {
  emitBio();
});

</script>
