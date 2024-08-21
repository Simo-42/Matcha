<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Barre de navigation latérale -->
    <nav class="w-1/4 max-w-xs bg-white p-6 shadow-lg">
      <ul class="space-y-4">
        <li>
          <NuxtLink to="/gps" class="block text-lg font-semibold text-gray-700 hover:text-indigo-600">
            Localisation
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/profil_mod" class="block text-lg font-semibold text-gray-700 hover:text-indigo-600">
            Profil
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/modify_personal" class="block text-lg font-semibold text-gray-700 hover:text-indigo-600">
            Données Personnelles
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="#photos" class="block text-lg font-semibold text-gray-700 hover:text-indigo-600">
            Photos
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>

</script>

<style scoped>
/* Styles supplémentaires */
</style>
 