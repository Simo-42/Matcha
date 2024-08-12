<template>
  <div>
    <h1 class="text-2xl font-semibold text-center">User modification</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

import user_form from '~/components/User_form.vue';
</script>
