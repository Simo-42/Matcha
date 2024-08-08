<template>
  <div>
    <Password_form />
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import Password_form from '~/components/Password_form.vue';

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute(); // pour recup la route ou il ya le token
const message = ref('');

onMounted(async () => {
  console.log("s'execute bien ! ");
  const resetToken = route.params.token; // Récupère le token depuis l'URL
  try {
    // Envoie une requête GET au serveur pour vérifier le token
    const response = await axios.get(`http://localhost:3000/verify_password/${resetToken}`);
    message.value = response.data; // Met à jour le message de succès
  } catch (error) {
    message.value = 'Invalid or expired token';
  }
});
</script>

 