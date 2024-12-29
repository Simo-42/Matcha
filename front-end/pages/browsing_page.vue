<template>
  <div>
    <Header />
    <start_to_swipe />
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";
import start_to_swipe from "~/components/Start_to_swipe.vue";

definePageMeta({
  middleware: ["auth"],
});

// import start_to_swipe from '~/components/Start_to_swipe.vue';
</script>
