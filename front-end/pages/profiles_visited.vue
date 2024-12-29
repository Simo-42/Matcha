<template>
  <div>
    <Header />
    <!-- <user_form /> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import { ref } from "vue";
import Header from "~/components/Header.vue";
</script>
