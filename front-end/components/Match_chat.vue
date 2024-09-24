<template>
	<div class="flex h-screen">
		<!-- Sidebar (Profiles list) -->
		<div class="w-1/3 bg-gray-200 p-4">
			<h2 class="text-2xl font-bold mb-4">Profiles</h2>
			<ul>
				<li v-for="profile in profiles" :key="profile.id" @click="selectProfile(profile)" class="cursor-pointer mb-2 p-2 bg-white rounded shadow hover:bg-gray-100">
					{{ profile.username }}
					{{ profile.connected ? "🟢" : "🔴" }}
				</li>
			</ul>
		</div>

		<!-- Chat area -->
		<div class="w-2/3 p-4 flex flex-col">
			<div v-if="selectedProfile">
				<h2 class="text-2xl font-bold mb-4">Chat with {{ selectedProfile.username }}</h2>

				<!-- Messages display -->
				<div class="flex-1 overflow-y-auto mb-4 p-2 bg-gray-100 rounded shadow">
					<!-- Affiche les messages si messages[selectedProfile.id] existe et a des données -->
					<div v-if="messages[selectedProfile.id] && messages[selectedProfile.id].length">
						<div v-for="(message, index) in messages[selectedProfile.id]" :key="index" class="mb-2">
							<p class="text-sm text-gray-800">
								<strong>{{ message.sender_id === selectedProfile.id ? selectedProfile.username : profile_name }}:</strong> {{ message.message_text }}
								<!-- <p> {{ message.sender.id }} </p> -->
								<!-- <p> {{ selectedProfile.id }} </p> -->
							</p>
						</div>
					</div>
					<!-- Si pas de messages, afficher un message d'information -->
					<div v-else>
						<p class="text-gray-500">No messages yet. Start the conversation!</p>
					</div>
				</div>

				<!-- Input for new message -->
				<div class="flex">
					<input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" class="flex-1 p-2 border border-gray-300 rounded-l" />
					<button @click="sendMessage" class="bg-blue-500 text-white p-2 rounded-r">Send</button>
				</div>
			</div>
			<div v-else>
				<p class="text-gray-500">Select a profile to start chatting.</p>
			</div>
		</div>
	</div>
</template>

<script setup>
// 1 - Creer la fonctionalite pour lenvoie de message et les save dans la db
// 2 - Creer la fonctionnalite pour recuperer les messages de la db entre deux utilisateurs
// 3 - Creer la fonctionalite pour pouvoir bloquer un utilisateur
// 4 - Pouvoir mettre un jour avec les sockets pour avoir les messages en temps reel
// Enregistrer les messages dans la base de données dans le cote serveur (backend)
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
const { $socket } = useNuxtApp();

const profiles = ref([]);
const selectedProfile = ref(null);
const newMessage = ref("");
const my_profile = ref([]);
const my_profile_id = ref(0);
const profile_name = ref("");
// Store messages for each profile
const messages = ref({});

const fetchMsgConversation = async (receiverId) => {
	try {
		const response = await axios.get("http://localhost:3005/api/message/get_messages", {
			params: { receiver_id: receiverId }, // Avec get on passe les params avec params:
			withCredentials: true,
		});
		messages.value[receiverId] = response.data;
	} catch (error) {
		console.error("Error fetching messages: ", error);
	}
};
const fetchMyCurrentProfil = async () => {
	try {
		const response = await axios.get("http://localhost:3005/api/after_auth/profil/spec_info", {
			withCredentials: true,
		});
		profile_name.value = response.data.result.username;
		my_profile_id.value = response.data.userId;
		console.log("my_profile_id.value", my_profile_id.value);
	} catch (error) {
		console.error("Error fetching messages: ", error);
	}
};

const fetchProfileData = async () => {
	try {
		const response = await axios.get("http://localhost:3005/api/swipe/get_user_match", {
			withCredentials: true,
		});
		profiles.value = response.data.UserMatchs;
		profiles.value = profiles.value.map((profile) => {
			if (typeof profile.interests === "string") {
				profile.interests = JSON.parse(profile.interests);
			}
			profile.photos = Array.isArray(profile.photos) ? profile.photos.map((photo) => photo.replace("/app", "")) : [];
			messages[profile.id] = [];
			return profile;
		});
	} catch (error) {
		console.error("Error fetching profile data: ", error);
	}
};

// Select profile to chat with
const selectProfile = async (profile) => {
	selectedProfile.value = profile;
	await fetchMsgConversation(profile.id);
};

// Send message and store it in the messages object
const sendMessage = async () => 
{
	// console.log("selectedProfile.value.id", selectedProfile.value.id);
	// console.log("my_profile_id.value", my_profile_id.value);
	console.log("Send message function");
	if (newMessage.value.trim() && selectedProfile.value && selectedProfile.value.id && my_profile_id.value) {
		console.log("in send message function ==== ", selectedProfile.value.id);
		// console.log("my_profile_id.value", my_profile_id.value);
		// console.log("newMessage.value", newMessage.value);
		try {
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

onMounted(async () => {
	// console.log("mounted", $socket);
	await fetchProfileData();
	await fetchMyCurrentProfil();

	const { $socket } = useNuxtApp();
	const status = "tchat";
	const userId = my_profile_id.value;
	if (userId) console.log("userId côté client :", userId);

	$socket.io.opts.query = { userId, status }; // Passer l'ID de l'utilisateur connecté au serveur
	$socket.io.opts.transports = ["websocket"]; // Forcer WebSocket sinon le serveur utilise polling par défaut

	$socket.connect();
	setupMessageListener();
});

onBeforeUnmount(() => {
	const { $socket } = useNuxtApp();
	$socket.off("Receive message"); // Désabonner le listener pour éviter les fuites de mémoire
});

const setupMessageListener = () => {
	const { $socket } = useNuxtApp();

	$socket.on("Receive message", (result) => {
		console.log("Socket emit Receive message", result);

		// Vérifie que le message reçu correspond à la conversation active
		if (result.sender_id === selectedProfile.value.id || result.receiver_id === selectedProfile.value.id) {
			if (!messages.value[selectedProfile.value.id]) {
				messages.value[selectedProfile.value.id] = [];
			}

			messages.value[selectedProfile.value.id].push({
				sender_id: result.sender_id,
				receiver_id: result.receiver_id,
				message_text: result.message_text,
				sent_at: result.sent_at,
			});
		}
	});
};

</script>

<style scoped>
/* Add any additional styles here */
</style>
