<template>
  <div>
    <Header />
    <usermod />
    <!-- <user_form /> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import { ref } from "vue";
import axios from "axios";
import user_form from "~/components/User_form.vue";
import usermod from "~/components/User_mod.vue";
</script>
