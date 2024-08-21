<template>
  <div>
    <logout />
    <gps />
  </div>
</template>

<script setup>
import logout from '~/components/Logout.vue';
import gps from '~/components/profil/gps_location.vue';

</script>

<style scoped>
html, body {
  height: 100%;
  background-color: white;
}
</style>