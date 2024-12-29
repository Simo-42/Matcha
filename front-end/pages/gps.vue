<template>
  <div>
    <header />
    <gps />
  </div>
</template>

<script setup>
import header from "~/components/Header.vue";
import gps from "~/components/profil/gps_location.vue";
definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped>
html,
body {
  height: 100%;
  background-color: white;
}
</style>
