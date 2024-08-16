<template>
  <div>
    <logout />
    <Welcome />
  </div>
</template>


<script setup>

definePageMeta({
  middleware: ["auth"]
})

import logout from '~/components/Logout.vue';
import Welcome from '~/components/Welcome.vue';
</script>

