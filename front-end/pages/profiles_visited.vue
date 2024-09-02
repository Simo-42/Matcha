<template>
  <div>
  
	  <Logout />
    <!-- <user_form /> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

import { ref } from 'vue';
import Logout from '~/components/Logout.vue';
</script>
