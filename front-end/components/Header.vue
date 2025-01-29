<template>
  <div class="p-4 flex " style="background-color: #ad77b6">
    <nav class="ml-4 flex justify-between items-center">
      <nuxt-link to="/browsing_page" class="text-white text-2xl font-semibold"
        >PurpleMatch</nuxt-link
      >
    </nav>
    <header class="ml-8 container mq-auto flex justify-between items-center">
      <div class="md:flex space-x-4">
        <nuxt-link
          to="/browsing_page"
          class="text-white px-3 py-2 rounded-md text-base font-medium"
          >Browsing profil</nuxt-link
        >
        <nuxt-link
          to="/match"
          class="text-white px-3 py-2 rounded-md text-base font-medium"
          >Matchs</nuxt-link
        >
        <nuxt-link
          to="/my_profil"
          class="text-white px-3 py-2 rounded-md text-base font-medium"
          >My profil</nuxt-link
        >
        <nuxt-link
          to="/settings"
          class="text-white px-3 py-2 rounded-md text-base font-medium"
          >Settings</nuxt-link
        >
      </div>
    </header>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
