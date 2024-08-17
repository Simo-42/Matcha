<template>
  <div>
    <logout />
    <After_auth_form />
  </div>
</template>


<script setup>

definePageMeta({
  middleware: ["auth"]
})

import logout from '~/components/Logout.vue';
import After_auth_form from '~/components/After_auth_form.vue';
</script>

