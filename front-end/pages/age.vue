<template>
  <div>
    <Header />
    <age />
  </div>
</template>

<script setup>
import age from "~/components/profil/age.vue";
import Header from "~/components/Header.vue";

definePageMeta({
  middleware: ["auth"],
});
</script>
