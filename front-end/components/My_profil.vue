<template>
  <div class="max-w-sm  border border-gray-500 rounded-lg shadow-md overflow-hidden mx-auto mt-10" style="background-color:#ad77b6;">
    <div class="relative h-96">
      <!-- Image slider -->
      <div class="h-full w-full relative flex items-center justify-center" tabindex="0">
        <img
          v-for="(photo, index) in photos.filter((photo) => photo)"
          :key="index"
          :src="`http://localhost:3005${photo}`"
          :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
          class="absolute w-64 h-64 object-cover transition-opacity duration-300 rounded-full"
          alt="User Photo"
        />
      </div>
      <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        <button
          v-for="(photo, index) in photos.filter((photo) => photo)"
          :key="index"
          @click="currentSlide = index"
          :class="[
            'w-2 h-2 rounded-full transition-all duration-300',
            currentSlide === index ? 'bg-white w-4' : 'bg-white/50'
          ]"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>
    </div>

    <div class="p-6">
      <div class="flex flex-row space-between ">
        <h2 class="text-2xl font-bold text-indigo-200">
          {{ firstname }} {{ lastname }}
          <h2 class="text-center">{{ age }} ans</h2>
        </h2>
        <div class="pl-8">
          <div class="items-center">
            <span class="text-indigo-200 font-medium">Gender:</span>
            <span class="ml-2 text-white">{{ gender }}</span>
          </div>
          <div class="items-center mt-2">
            <span class="text-indigo-200 font-medium">Preference:</span>
            <span class="ml-2 text-white">{{ sexual_preference }}</span>
          </div>
          <div class="items-center mt-2">
            <span class="text-indigo-200 font-medium">Location:</span>
            <span class="ml-2 text-white">{{ location }}</span>
          </div>
        </div>
      </div>

      <p
        class="text-white mt-4 bg-fuchsia-400 p-4 rounded-lg border border-gray-300">
        {{ biography }}
      </p>

      <div class="mt-4">
        <h3 class="text-lg font-bold text-indigo-200">Interests</h3>
        <div class="flex flex-wrap mt-2">
          <span
            v-for="(interest, index) in interests"
            :key="index"
            class="bg-fuchsia-400 text-white rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2">
            {{ interest }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, onBeforeUnmount } from "vue";

interface ProfileData {
  firstname: string;
  lastname: string;
  age: number;
  biography: string;
  gender: string;
  sexual_preference: string;
  interests: string[];
  location: string;
  photos: string[];
}

const photos = ref<string[]>([]);
const firstname = ref<string>("");
const lastname = ref<string>("");
const age = ref<number>(0);
const biography = ref<string>("");
const gender = ref<string>("");

const sexual_preference = ref<string>("");
const interests = ref<string[]>([]);
const location = ref<string>("");

const currentSlide = ref(0);
const isPlaying = ref(false);
let slideInterval: NodeJS.Timeout | null = null;

function nextSlide() {
  const filteredPhotos = photos.value.filter(photo => photo);
  currentSlide.value = (currentSlide.value + 1) % filteredPhotos.length;
}

function prevSlide() {
  const filteredPhotos = photos.value.filter(photo => photo);
  currentSlide.value = (currentSlide.value - 1 + filteredPhotos.length) % filteredPhotos.length;
}

function startSlideshow() {
  if (!slideInterval) {
    slideInterval = setInterval(nextSlide, 2000); // Change slide every 3 seconds
  }
}

function stopSlideshow() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

async function fetchProfileData() {
  try {
    const response = await axios.get<{ result: ProfileData }>(
      "http://localhost:3005/api/after_auth/profil/my_profil_info",
      {
        withCredentials: true,
      }
    );

    console.log("Profile data:", response.data.result);
    const data = response.data.result;
    firstname.value = data.firstname;
    lastname.value = data.lastname;
    biography.value = data.biography;
    gender.value = data.gender;

    photos.value = Array.isArray(data.photos)
      ? data.photos.map((photo) => photo.replace("/app", ""))
      : []; // Supprime app dans toutes les URL des photos
    age.value = data.age;
    sexual_preference.value = data.sexual_preference;
    location.value = data.location;
    interests.value = Array.isArray(data.interests)
      ? data.interests
      : JSON.parse(data.interests);

    // console.log("La valuer de photos", photos.value); // Ligne de débogage pour vérifier les URLs des photos
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
}

onMounted(() => {
  fetchProfileData();
  startSlideshow(); // new
  // Add keyboard event listeners
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
});

onBeforeUnmount(() => {
  stopSlideshow();
  window.removeEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
});
</script>

<style scoped>
.opacity-0 {
  opacity: 0;
}
.opacity-100 {
  opacity: 1;
}
</style>
