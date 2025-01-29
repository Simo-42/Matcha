<template>
  <div>
    <button
      @click="showModal = true"
      class="block text-lg font-semibold text-gray-700 hover:text-indigo-600"
    >
      Modify Location
    </button>

    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-opacity-50"
    >
      <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative">
        <button
          @click="showModal = false"
          class="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        <h2 class="text-3xl font-extrabold text-center mb-6 text-gray-900">
          Put Your Location
        </h2>

        <p v-if="city" class="text-center text-gray-700 mb-6">
          Your current location is: <br />
          <span class="font-semibold">{{ city }}</span>
        </p>
        <div class="flex flex-col items-center">
          <button
            @click="get_Location"
            class="mb-4 btn_color text-white font-semibold py-3 px-5 rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Get My Location
          </button>

          <input
            v-model="location_input"
            placeholder="Enter a place"
            class="mb-4 px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />

          <button
            @click="search_location"
            class="mb-4 btn_color text-white font-semibold py-3 px-5 rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Search Location
          </button>
        </div>

        <LeafletMap
          v-if="mapVisible"
          :latitude="latitude"
          :longitude="longitude"
          class="mb-4 rounded-lg shadow-lg"
        />

        <p v-if="errorMessage" class="text-red-500 text-center mt-4">
          {{ errorMessage }}
        </p>
        <div class="flex justify-center">
            <button
            v-if="showSubmit"
            @click="submit_location"
            class=" btn_color text-white font-semibold py-3 px-5 rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
            Submit Location
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import LeafletMap from "~/components/profil/lefletmap.vue";

const location_input = ref("");
const latitude = ref(null);
const longitude = ref(null);
const city = ref("");
const mapVisible = ref(false);
const errorMessage = ref("");
const message = ref("");
const showModal = ref(false);
const showSubmit = ref(false);

const get_Location = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        mapVisible.value = true;
        // Recherche du nom de la ville via l'API OpenStreetMap
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude.value}&lon=${longitude.value}&format=json`
          );
          const data = await response.json();
          if (data && data.address) {
            city.value =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "Location not found";
          } else {
            city.value = "Location not found";
          }
        } catch {
          city.value = "Failed to retrieve city name";
        }
      },
      () => {
        errorMessage.value = "Failed to retrieve your location.";
      }
    );
  } else {
    errorMessage.value = "Geolocation is not supported by this browser.";
  }
};

const search_location = async () => {
  if (location_input.value) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location_input.value
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        latitude.value = parseFloat(data[0].lat);
        longitude.value = parseFloat(data[0].lon);
        city.value = data[0].display_name.split(",")[0]; // Extraire le nom de la ville
        mapVisible.value = true;
        showSubmit.value = true;
      } else {
        errorMessage.value = "Location not found.";
      }
    } catch {
      errorMessage.value = "Failed to search location.";
    }
  } else {
    errorMessage.value = "Please enter a location.";
  }
};

const submit_location = async () => {
    try {
      console.log("location_input.value", location_input.value);
    const response = await axios.post(
      "http://localhost:3005/api/after_auth/profil/location",
      {
        location: location_input.value,
      },
      {
        withCredentials: true,
      }
    );
    message.value = response.message;
    showModal = false;
    mapVisible.value = false;
    consolo.log("error", error);

    } catch (error) {
        consolo.log("error");
        message.value = error.response.data.error || "Registration failed";
  }
};
</script>

<style scoped>
body,
html {
  height: 100%;
  margin: 0;
  overflow-y: hidden;
}

.btn_color {
  background-color: #8e6196;
}
</style>
