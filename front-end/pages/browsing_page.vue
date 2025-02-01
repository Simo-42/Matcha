<template>
  <div>
    <Header />
    <CardSwipe />
  </div>
</template>

<script setup>
import CardSwipe from '~/components/CardSwipe.vue';
import Header from '~/components/Header.vue';

definePageMeta({
  middleware: ["auth"],
});
</script>
