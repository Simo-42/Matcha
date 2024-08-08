<template>
  <div>
    <h1>Email Verification</h1>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const message = ref('');

onMounted(async () => {
  const userId = route.params.id; // Récupère l'ID de l'utilisateur depuis l'URL
  try {
    // Envoie une requête GET au serveur pour vérifier l'email de l'utilisateur
    const response = await axios.get(`http://localhost:3000/verify/${userId}`);
    message.value = response.data; // Met à jour le message de succès
  } catch (error) {
    message.value = 'Waiting for your'; 
  }
});
</script>
a