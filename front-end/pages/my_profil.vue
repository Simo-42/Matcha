<template>
  <div>
    <Header/>
    <My_profil />
  </div>
</template>

<script setup>
import My_profil from "~/components/My_profil.vue";
import Header from "~/components/Header.vue";
</script>

<style scoped>
html,
body {
  height: 100%;
  background-color: white;
	overflow-y: hidden;
}
</style>
