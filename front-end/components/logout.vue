<template>
  <nav class="bg-indigo-600 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg font-semibold">
        Matcha
      </div>
      <div class="space-x-4">
        <nuxt-link to="/usermod" class="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">Modifier le Profil</nuxt-link>
        <button @click="logout" class="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const logout = async () => {
  try {
    await axios.post('http://localhost:3005/api/auth/logout'); // Remplacez par la route de votre serveur
    router.push('/auth'); // Redirige vers la page de connexion après la déconnexion
  } catch (error) {
    console.error('Failed to log out:', error);
  }
};
</script>

<style scoped>
/* Vous pouvez ajouter des styles supplémentaires ici si nécessaire */
</style>
