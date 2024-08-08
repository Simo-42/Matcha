<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Welcome to Matcha</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <p class="text-sm text-gray-500">You have successfully signed in!</p>
      <nuxt-link to="/auth" class="mt-6 block text-indigo-600 hover:text-indigo-500">Go back to Sign In</nuxt-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Ajoutez ici des styles supplémentaires si nécessaire */
</style>
