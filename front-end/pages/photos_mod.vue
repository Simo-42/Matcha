<template>
  <div>
    <logout />
	<modify_photo />
  </div>
</template>

<script setup>
import upload_pictures from '~/components/profil/upload_pictures.vue';
import modify_photo from '~/components/Photos_modifcation.vue';
definePageMeta({
  middleware: ["auth"]
})

</script>
