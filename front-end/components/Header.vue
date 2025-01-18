<template>
  <nav class="bg-indigo-600 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg font-semibold">GreenMatch</div>
      <div class="space-x-4">
        <nuxt-link
          to="/browsing_page"
          class="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
          >Browsing profil</nuxt-link
        >
        <nuxt-link
          to="/usermod"
          class="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
          >Modify your Profil</nuxt-link
        >
        <nuxt-link
          to="/visitors"
          class="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
          >Visitors</nuxt-link
        >
        <nuxt-link
          to="/match"
          class="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
          >Matchs</nuxt-link
        >
        <nuxt-link
          to="/Likes"
          class="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
          >Likes Pages</nuxt-link
        >
        <nuxt-link
          to="/test"
          class="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
          >Notification</nuxt-link
        >
        <nuxt-link
          to="/my_profil"
          class="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
          >My profil</nuxt-link
        >

        <button
          @click="header"
          class="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
          Header
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();
const userId = ref(0);
const { $socket } = useNuxtApp();

async function fetchMyCurrentProfil() {
  try {
    const response = await axios.get(
      "http://localhost:3005/api/after_auth/profil/spec_info",
      {
        withCredentials: true,
      }
    );
    userId.value = response.data.userId;
    return userId.value;
  } catch (error) {
    console.error("Error fetching messages: ", error);
  }
}

async function header() {
  try {
    await axios.post("http://localhost:3005/api/jwt/header");
    $socket.disconnect();
    router.push("/auth");
  } catch (error) {
    console.error("Failed to log out:", error);
  }
}

onMounted(async () => {
  await fetchMyCurrentProfil();
  const status = "online";
  $socket.io.opts.query = { userId: userId.value, status };
  $socket.io.opts.transports = ["websocket"]; // Forcer WebSocket sinon le serveur utilise polling
  $socket.connect();
  $socket.emit("user_connected", { userId: userId.value });
});

onBeforeUnmount(() => {
  if ($socket.connected) {
    $socket.disconnect();
  }
});
</script>

<style scoped></style>
