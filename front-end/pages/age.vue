<template>
	<div>
		<logout />
		<age />
	</div>
</template>

<script setup>
import age from "~/components/profil/age.vue";
import logout from "~/components/Logout.vue";
definePageMeta({
	middleware: ["auth"],
});
</script>
