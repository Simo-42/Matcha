<template>
	<Logout />
	<!-- <user_mod /> -->
	<user_form />
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["auth"],
});

import { ref } from "vue";
import axios from "axios";
import user_form from "~/components/User_form.vue";
import user_mod from "~/components/User_mod.vue";
</script>
