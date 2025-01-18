<template>
  <div class="flex h-screen">
    <!-- Sidebar (Profiles list) -->
    <div class="w-1/3 bg-gray-200 p-4">
      <h2 class="text-2xl font-bold mb-4">Profiles</h2>
      <ul>
        <li
          v-for="profile in profiles"
          :key="profile.id"
          @click="selectProfile(profile)"
          class="cursor-pointer mb-2 p-2 bg-white rounded shadow hover:bg-gray-100">
          {{ profile.username }}
          {{ profile.connected ? "🟢" : "🔴" }}
        </li>
      </ul>
    </div>

    <!-- Chat area -->
    <div class="w-2/3 p-4 flex flex-col">
      <div v-if="selectedProfile">
        <h2 class="text-2xl font-bold mb-4">
          Chat with {{ selectedProfile.username }}
        </h2>

        <!-- Messages display -->
        <div class="flex-1 overflow-y-auto mb-4 p-2 bg-gray-100 rounded shadow">
          <!-- Affiche les messages si messages[selectedProfile.id] existe et a des données -->
          <div
            v-if="
              messages[selectedProfile.id] &&
              messages[selectedProfile.id].length
            ">
            <div
              v-for="(message, index) in messages[selectedProfile.id]"
              :key="index"
              class="mb-2">
              <p class="text-sm text-gray-800">
                <strong
                  >{{
                    message.sender_id === selectedProfile.id
                      ? selectedProfile.username
                      : profile_name
                  }}:</strong
                >
                {{ message.message_text }}
              </p>
            </div>
          </div>
          <!-- Si pas de messages, afficher un message d'information -->
          <div v-else>
            <p class="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>

        <!-- Indicateur 'En train d'écrire' -->
        <p v-if="isTyping">
          {{ selectedProfile.username }} est en train d'écrire...
        </p>

        <!-- Input for new message -->
        <div class="flex">
          <input
            v-model="newMessage"
            @input="handleTyping"
            @keyup.enter="sendMessage"
            placeholder="Type a message"
            class="flex-1 p-2 border border-gray-300 rounded-l" />
          <button
            @click="sendMessage"
            class="bg-blue-500 text-white p-2 rounded-r">
            Send
          </button>
        </div>
      </div>

      <div v-else>
        <p class="text-gray-500">Select a profile to start chatting.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 1 - Creer la fonctionalite pour lenvoie de message et les save dans la db
// 2 - Creer la fonctionnalite pour recuperer les messages de la db entre deux utilisateurs
// 3 - Creer la fonctionalite pour pouvoir bloquer un utilisateur
// 4 - Pouvoir mettre un jour avec les sockets pour avoir les messages en temps reel
// Enregistrer les messages dans la base de données dans le cote serveur (backend)
import axios from "axios";
import { onMounted, ref } from "vue";
const { $socket } = useNuxtApp();

const profiles = ref<Profile[]>([]);
interface Profile {
  id: number;
  username: string;
  connected: boolean;
  interests?: string[];
  photos?: string[];
}

const selectedProfile = ref<Profile | null>(null);
const newMessage = ref("");
const my_profile_id = ref(0);
const profile_name = ref("");
const isTyping = ref(false);
const typingTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const messages = ref<{
  [key: number]: {
    sender_id: number;
    receiver_id: number;
    message_text: string;
    sent_at?: string;
  }[];
}>({});
// Store messages for each profile

async function handleTyping() {
  // Émettre un événement 'userTyping'
  if (selectedProfile.value == null) return;
  const roomId =
    my_profile_id.value < selectedProfile.value.id
      ? `room_${my_profile_id.value}_${selectedProfile.value.id}`
      : `room_${selectedProfile.value.id}_${my_profile_id.value}`;
  const userId = my_profile_id.value;
  console.log("roomId", roomId);
  console.log("userId", userId);
  $socket.emit("userTyping", {
    roomId: roomId,
    userId: userId,
  });
}
async function fetchMsgConversation(receiver_id: any) {
  try {
    const response = await axios.get(
      "http://localhost:3005/api/message/get_messages",
      {
        params: { receiver_id: receiver_id }, // Avec get on passe les params avec params:
        withCredentials: true,
      }
    );

    messages.value[receiver_id] = response.data;
  } catch (error) {
    console.error("Error fetching messages: ", error);
  }
}

async function fetchMyCurrentProfil() {
  try {
    const response = await axios.get(
      "http://localhost:3005/api/after_auth/profil/spec_info",
      {
        withCredentials: true,
      }
    );

    profile_name.value = response.data.result.username;
    my_profile_id.value = response.data.userId;
    console.log("my_profile_id.value", my_profile_id.value);
  } catch (error) {
    console.error("Error fetching my current profil: ", error);
  }
}

async function fetchProfileData() {
  try {
    const response = await axios.get(
      "http://localhost:3005/api/swipe/get_user_match",
      {
        withCredentials: true,
      }
    );

    profiles.value = response.data.UserMatchs;
    profiles.value = profiles.value.map((profile: Profile): Profile => {
      if (typeof profile.interests === "string") {
        profile.interests = JSON.parse(profile.interests);
      }
      profile.photos = Array.isArray(profile.photos)
        ? profile.photos.map((photo) => photo.replace("/app", ""))
        : [];
      messages.value[profile.id] = [];
      return profile;
    });
  } catch (error) {
    console.error("Error fetching profile data: ", error);
  }
}

async function selectProfile(profile :Profile) {
  selectedProfile.value = profile;
  const roomId =
    my_profile_id.value < profile.id
      ? `room_${my_profile_id.value}_${profile.id}`
      : `room_${profile.id}_${my_profile_id.value}`;
  // Create the roomId with the smaller id first
  console.log("roomId", roomId);
  $socket.emit("joinRoom", { roomId });
  await fetchMsgConversation(profile.id);
}
// Send message and store it in the messages object
const sendMessage = async () => {
  // console.log("je suis dans send message");
  // console.log("selectedProfile.value", selectedProfile.value);
  // console.log("selectedProfile.value.id", selectedProfile.value.id);
  // console.log("my_profile_id.value", my_profile_id.value);
  // console.log("newMessage.value", newMessage.value);
  if (
    newMessage.value.trim() &&
    selectedProfile.value &&
    selectedProfile.value.id &&
    my_profile_id.value
  ) {
    try {
      // console.log("je suis dans send message")
      $socket.emit("Send message", {
        message: newMessage.value,
        receiver_id: selectedProfile.value.id,
        sender_id: my_profile_id.value,
      });

      // Vide le champ de texte après l'envoi
      newMessage.value = "";
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  }
};
onMounted(async function () {
  // console.log("mounted", $socket);
  await fetchProfileData();
  await fetchMyCurrentProfil();
  const { $socket } = useNuxtApp();
  const userId = my_profile_id.value;

  $socket.io.opts.query = { userId }; // Passer l'ID de l'utilisateur connecté au serveur
  $socket.io.opts.transports = ["websocket"]; // Forcer WebSocket sinon le serveur utilise polling par défaut
  $socket.connect();
  setupMessageListener();
});

onBeforeUnmount(() => {
  const { $socket } = useNuxtApp();
  if ($socket) {
    $socket.off("Receive message"); // Désabonner le listener pour éviter les fuites de mémoire
    $socket.off("joinRoom");
    $socket.off("userIsTyping");
    // $socket.disconnect(); // Déconnecte le client du serveur
  }
});

function setupMessageListener() {
  const { $socket } = useNuxtApp();
  console.log("Setup message listener");

  // Ecouter les messages reçus
  $socket.on("Receive message", function (result) {
    // prettier-ignore
    if (selectedProfile.value && (result.sender_id === selectedProfile.value.id || result.receiver_id === selectedProfile.value.id)) 
		{
			if (!messages.value[selectedProfile.value.id]) {
				messages.value[selectedProfile.value.id] = [];
			}

			messages.value[selectedProfile.value.id].push({
				sender_id: result.sender_id,
				receiver_id: result.receiver_id,
				message_text: result.message_text,
				sent_at: result.sent_at,
			});

			console.log(
				`Message ajouté à la conversation avec ${selectedProfile.value.username}`,
				messages.value[selectedProfile.value.id]
			);
		} else {
			console.log("Message reçu pour une autre conversation ou profil non sélectionné.");
		}
  });

  $socket.on("userIsTyping", function (data) {
    console.log("Données reçues dans userIsTyping :", data);

    if (data && data.userId) {
      const { userId } = data;
      console.log("userId reçu :", userId);
      console.log("Mon propre ID :", my_profile_id.value);

      if (userId !== my_profile_id.value) {
        // Vérification que l'utilisateur qui tape est différent
        console.log("L'utilisateur est en train d'écrire:", userId);
        isTyping.value = true;

        // Réinitialiser l'indicateur après 2 secondes d'inactivité
        if (typingTimeout.value) {
          clearTimeout(typingTimeout.value);
        }
        typingTimeout.value = setTimeout(() => {
          isTyping.value = false;
          console.log("L'utilisateur a arrêté d'écrire:", userId);
        }, 2000);
      }
    } else {
      console.error("userId non défini dans l'événement userIsTyping");
    }
  });
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
