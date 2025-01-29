<template>
  <button
    @click="logout"
    class="block text-lg font-semibold text-red hover:text-gray-700"
  >
    Logout
  </button>
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
