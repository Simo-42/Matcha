<template>
  <div>
    <h1>Welcome to Nuxt 3</h1>
    <nuxt-link to="/register">Go to Register</nuxt-link>
  </div>
</template>

<script setup>
import RegisterForm from '~/components/RegisterForm.vue';
</script>

<style scoped>
html, body {
  height: 100%;
  background-color: white;
}
</style>