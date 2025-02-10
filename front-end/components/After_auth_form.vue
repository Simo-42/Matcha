<template>
  <div class="home_bg min-h-screen flex items-center justify-center">
    <form
      @submit.prevent="submitForm"
      class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <Gender_select
        :selectedGender="selectedGender"
        @updateGender="updateGender" />
      <Sexual_pref
        :selectedSexualPref="selectedSexualPref"
        @updateSexualPref="updateSexualPref" />
      <Biography_form :SelectedBio="SelectedBio" @updateBio="updateBio" />
      <Interests_select
        :selectedInterests="selectedInterests"
        @updateInterests="updateInterests" />
      <button
        type="submit"
        class="mt-6 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
        Soumettre
      </button>
    </form>
  </div>
  <div class="text-center mt-4 text-red-500">{{ message }}</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import Biography_form from "~/components/profil/biography.vue";
import Gender_select from "~/components/profil/gender.vue";
import Interests_select from "~/components/profil/interests.vue";
import Sexual_pref from "~/components/profil/sexual_pref.vue";
import "/css/home.css";

const selectedGender = ref("");
const selectedSexualPref = ref("");
const SelectedBio = ref("");
const selectedInterests = ref<string[]>([]);
const message = ref("");

function updateGender(newGender: string) {
  selectedGender.value = newGender;
}

function updateSexualPref(newPref: string) {
  selectedSexualPref.value = newPref;
}
function updateBio(newBio: string) {
  SelectedBio.value = newBio;
}

function updateInterests(newInterests: string[]) {
  selectedInterests.value = newInterests;
}

async function submitForm() {
  try {
    if (
      !selectedGender.value ||
      !selectedSexualPref.value ||
      !SelectedBio.value ||
      selectedInterests.value.length === 0
    ) {
      message.value = "Please fill in all fields";
      return;
    }
    const response = await axios.post(
      "http://localhost:3005/api/after_auth/profil/update",
      {
        gender: selectedGender.value,
        sexual_preference: selectedSexualPref.value,
        biography: SelectedBio.value,
        interests: JSON.stringify(selectedInterests.value), // Conversion en JSON
      },
      {
        withCredentials: true, //!! Ultra important pour que les cookies soient envoyés
      }
    );
    message.value = response.data.message;
    navigateTo("/pictures");
  } catch (error) {
    console.log(message.value);
    console.log(error);
  }
}
</script>
