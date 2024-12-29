<template>
  <div>
    <Header />
    <security />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import { ref } from "vue";
import axios from "axios";
import user_form from "~/components/User_form.vue";
import security from "~/components/profil/security.vue";
</script>
