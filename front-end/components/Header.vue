<template>
  <nav class="p-4" style="background-color: #ad77b6">
    <div class="container mx-auto flex justify-between items-center">
      <nuxt-link to="/browsing_page" class="text-white text-lg font-semibold"
        >PurpleMatch</nuxt-link
      >
      <div class="hidden md:flex space-x-4">
        <nuxt-link
          to="/browsing_page"
          class="text-white px-3 py-2 rounded-md text-sm font-medium"
          >Browsing profil</nuxt-link
        >
        <nuxt-link
          to="/usermod"
          class="text-white px-3 py-2 rounded-md text-sm font-medium"
          >Modify your Profil</nuxt-link
        >
        <nuxt-link
          to="/visitors"
          class="text-white px-3 py-2 rounded-md text-sm font-medium"
          >Visitors</nuxt-link
        >
        <nuxt-link
          to="/match"
          class="text-white px-3 py-2 rounded-md text-sm font-medium"
          >Matchs</nuxt-link
        >
        <nuxt-link
          to="/Likes"
          class="text-white px-3 py-2 rounded-md text-sm font-medium"
          >Likes Pages</nuxt-link
        >
        <nuxt-link
          to="/test"
          class="text-white px-3 py-2 rounded-md text-sm font-medium"
          >Notification</nuxt-link
        >
        <nuxt-link
          to="/my_profil"
          class="text-white px-3 py-2 rounded-md text-sm font-medium"
          >My profil</nuxt-link
        >
        <button
          @click="logout"
          class="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Logout
        </button>
      </div>
      <div class="md:hidden">
        <button @click="toggleMenu" class="text-white focus:outline-none">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    <div v-if="isMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <nuxt-link
          to="/browsing_page"
          class="text-white block px-3 py-2 rounded-md text-base font-medium"
          >Browsing profil</nuxt-link
        >
        <nuxt-link
          to="/usermod"
          class="text-white block px-3 py-2 rounded-md text-base font-medium"
          >Modify your Profil</nuxt-link
        >
        <nuxt-link
          to="/visitors"
          class="text-white block px-3 py-2 rounded-md text-base font-medium"
          >Visitors</nuxt-link
        >
        <nuxt-link
          to="/match"
          class="text-white block px-3 py-2 rounded-md text-base font-medium"
          >Matchs</nuxt-link
        >
        <nuxt-link
          to="/Likes"
          class="text-white block px-3 py-2 rounded-md text-base font-medium"
          >Likes Pages</nuxt-link
        >
        <nuxt-link
          to="/test"
          class="text-white block px-3 py-2 rounded-md text-base font-medium"
          >Notification</nuxt-link
        >
        <nuxt-link
          to="/my_profil"
          class="text-white block px-3 py-2 rounded-md text-base font-medium"
          >My profil</nuxt-link
        >
        <button
          @click="logout"
          class="text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const userId = ref(0);
const isMenuOpen = ref(false);
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

async function logout() {
  try {
    await axios.post("http://localhost:3005/api/jwt/logout");
    console.log("logout");
    $socket.disconnect();
    router.push("/auth");
  } catch (error) {
    console.error("Failed to log out:", error);
  }
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
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
