<template>
  <div>
    <header />
    <modify_photo />
  </div>
</template>

<script setup>
import modify_photo from "~/components/Photos_modifcation.vue";
definePageMeta({
  middleware: ["auth"],
});
</script>
