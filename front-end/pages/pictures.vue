<template>
  <div>
    <header />
    <upload_pictures />
  </div>
</template>

<script setup>
import upload_pictures from "~/components/profil/upload_pictures.vue";

definePageMeta({
  middleware: ["auth"],
});
</script>
