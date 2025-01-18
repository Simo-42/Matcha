<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-account"
          text="Sign in"
          variant="tonal"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card prepend-icon="mdi-account" title="Sign in to your account">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="4" sm="6">
              <v-text-field label="Username*" required v-model="username"></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Password*"
                type="password"
                required
                v-model="password"
              ></v-text-field>
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis"
            >*indicates required field</small
          >
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

          <v-btn
            color="primary"
            text="Sign in"
            variant="tonal"
            @click="authentification"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <LottieAnimation v-if="showAnimation" :animationData="animationData" />
    <p v-if="message" class="mt-4 text-center text-sm text-red-500">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import LottieAnimation from "~/components/lotie/lotie_animation.vue"; // Replace with the correct path to your component
import animationData from "~/assets/lottie/valide.json"; // Replace with the correct path to your JSON file

const dialog = ref(false);
const username = ref("");
const password = ref("");
const message = ref("");
const showAnimation = ref(false);

async function authentification() {
  try {
    const response = await axios.post(
      "http://localhost:3005/api/auth/authentification",
      {
        username: username.value,
        password: password.value,
      },
      {
        withCredentials: true,
      }
    );

    if (response.data.profile_complete == true) {
      console.log("Profile is complete");
      showAnimation.value = true;
      setTimeout(() => {
        navigateTo("/connected");
      }, 2000);
    } else {
      console.log("response.data.profile_complete", response.data.profile_complete);
      console.log("Profile is not complete");
      showAnimation.value = true;
      setTimeout(() => {
        navigateTo("/after_auth_form");
      }, 2000);
    }
  } catch (error) {
    message.value = error.response?.data?.error || "Authentication failed";
  }
}
</script>
