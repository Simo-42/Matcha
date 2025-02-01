<template>
  <div class="flex min-h-screen bg-[#8e6196] items-center justify-center">
    <!-- Barre de navigation latérale -->
    <nav class="w-1/4 max-w-xs p-6 shadow-2xl mb-48">
      <ul class="space-y-4">
        <li>
          <Gps_location/>
        </li>
        <li>
          <UserModal/>
        </li>
        <li>
          <NuxtLink
            to="/personal_mod"
            class="block text-lg font-semibold text-gray-700 hover:text-indigo-600">
            Données Personnelles
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/photos_mod"
            class="block text-lg font-semibold text-gray-700 hover:text-indigo-600">
            Photos
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/security"
            class="block text-lg font-semibold text-gray-700 hover:text-indigo-600">
            Security
          </NuxtLink>
        </li>
        <li>
          <Logout/>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import Gps_location from './profil/gps_location.vue';
import UserModal from './UserModal.vue';

</script>

<style scoped>
/* .bg_color {
  background-color: #8e6196;
} */
</style>
