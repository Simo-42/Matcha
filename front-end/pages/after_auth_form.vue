<template>
  <div>
    <Header />
    <After_auth_form />
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';
import After_auth_form from "~/components/After_auth_form.vue";

definePageMeta({
  middleware: ["auth"],
});
</script>
