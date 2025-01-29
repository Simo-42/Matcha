<template>
  <div>
    <Header />
    <gps />
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";
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
	overflow-y: hidden;
}
</style>
