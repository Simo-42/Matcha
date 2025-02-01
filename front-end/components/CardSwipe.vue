<template>
  <div class="flex flex-col items-center min-h-screen py-8">
    <!-- Search filters -->
    <div class="mb-8 w-80">
      <select v-model="searchCriteria.age_gap" class="w-full mb-2 p-2 rounded">
        <option value="">Age range</option>
        <option value="18-25">18-25</option>
        <option value="26-35">26-35</option>
        <option value="36-50">36-50</option>
      </select>
      
      <select v-model="searchCriteria.fame_rating_gap" class="w-full mb-2 p-2 rounded">
        <option value="">Fame rating range</option>
        <option value="0-3">0-3</option>
        <option value="4-7">4-7</option>
        <option value="8-10">8-10</option>
      </select>

      <select v-model="searchCriteria.sort_by" class="w-full mb-2 p-2 rounded">
        <option value="">Sort by</option>
        <option value="age">Age</option>
        <option value="location">Location</option>
        <option value="fame_rating">Fame Rating</option>
        <option value="interests">Common Interests</option>
      </select>
    </div>

    <!-- Profile Cards -->
    <div v-if="profiles.length === 0" class="text-2xl text-gray-600">
      No more profiles to show
    </div>
    
    <div v-else class="relative w-80 h-[480px]">
      <div v-for="(profile, index) in profiles" :key="profile.id">
        <div
          v-show="currentIndex === index"
          :style="{ transform: `translateX(${translateX}px) rotate(${rotation}deg)` }"
          class="absolute w-full h-full transition-transform duration-300 ease-out"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @touchstart="startDrag"
          @touchmove="onDrag"
          @touchend="endDrag"
        >
          <!-- Profile Card Content -->
          <div class="bg-white rounded-lg shadow-xl overflow-hidden h-full">
            <img
              :src="profile.photos?.[0]?.photo_data || '/img/default_profile.jpg'"
              class="w-full h-1/2 object-cover"
              alt="Profile picture"
            />
            <div class="p-4">
              <div class="flex justify-between items-center mb-2">
                <h2 class="text-xl font-bold">
                  {{ profile.firstname }}, {{ profile.age }}
                </h2>
                <span class="text-sm text-gray-500">Fame: {{ profile.fame_rating }}</span>
              </div>
              <p class="text-gray-600 mb-2">{{ profile.biography }}</p>
              <!-- <div class="flex flex-wrap gap-2">
                <span v-for="interest in profile.interests" :key="interest"
                  class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                >
                  {{ interest }}
                </span>
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="profiles.length > 0" class="absolute bottom-[-70px] left-0 right-0 flex justify-center space-x-8">
        <button @click="handleDislike" class="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600">
          ✕
        </button>
        <button @click="handleLike" class="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600">
          ♥
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

const profiles = ref([]);
const currentIndex = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const translateX = ref(0);
const rotation = ref(0);

const searchCriteria = ref({
  age_gap: '',
  fame_rating_gap: '',
  interests: [],
  location_gap: '',
  sort_by: ''
});

// Fetch profiles with search criteria
async function fetchProfiles() {
  try {
    const response = await axios.get('http://localhost:3005/api/swipe/profil_to_match', {
      params: searchCriteria.value,
      withCredentials: true
    });
    profiles.value = response.data.profiles;
    console.log("Profiles fetched:", profiles.length, "------");
	console.log("Profile value",profiles[0]);
    currentIndex.value = 0;
  } catch (error) {
    console.error('Error fetching profiles:', error);
  }
}

// Watch for changes in search criteria
watch(searchCriteria.value, () => {
  fetchProfiles();
});

async function handleLike() {
  try {
    const response = await axios.post('http://localhost:3005/api/swipe/like_profil', {
      status: 'like',
      liked_user_id: profiles.value[currentIndex.value].id
    }, {
      withCredentials: true
    });
    
    if (response.data.match) {
      // Handle match notification
      alert("It's a match!");
    }
    nextProfile();
  } catch (error) {
    console.error('Error liking profile:', error);
  }
}

async function handleDislike() {
  try {
    await axios.post('http://localhost:3005/api/swipe/like_profil', {
      status: 'dislike',
      liked_user_id: profiles.value[currentIndex.value].id
    }, {
      withCredentials: true
    });
    nextProfile();
  } catch (error) {
    console.error('Error disliking profile:', error);
  }
}

// Swipe handlers
function startDrag(event) {
  isDragging.value = true;
  startX.value = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
}

function onDrag(event) {
  if (!isDragging.value) return;
  
  const currentX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
  const diff = currentX - startX.value;
  translateX.value = diff;
  rotation.value = diff * 0.1; // Adds rotation effect while dragging
}

function endDrag() {
  if (!isDragging.value) return;
  
  isDragging.value = false;
  const threshold = 100;

  if (translateX.value > threshold) {
    handleLike();
  } else if (translateX.value < -threshold) {
    handleDislike();
  } else {
    // Reset position if not swiped enough
    translateX.value = 0;
    rotation.value = 0;
  }
}

function nextProfile() {
  translateX.value = 0;
  rotation.value = 0;
  
  if (currentIndex.value < profiles.value.length - 1) {
    currentIndex.value++;
  } else {
    fetchProfiles();
  }
}

// Visit profile when card is viewed
async function setProfileVisited(profileId) {
  try {
    await axios.post('http://localhost:3005/api/swipe/set_profile_visited', {
      userIdTo: profileId
    }, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Error setting profile as visited:', error);
  }
}

// Initialize
onMounted(() => {
  fetchProfiles();
});

// Track profile views
watch(currentIndex, (newIndex) => {
  if (profiles.value[newIndex]) {
    setProfileVisited(profiles.value[newIndex].id);
  }
});
</script>

<style scoped>
/* Add any additional styling here */
</style>
