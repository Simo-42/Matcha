<template>
  <div>
    <Header />
    <usermod />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import usermod from "~/components/User_mod.vue";
import Header from "~/components/Header.vue"; 
</script>
