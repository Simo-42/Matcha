<template>
  <div class="pa-4">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="custom-btn"
          text="Créer un compte"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card
        @submit.prevent="register"
        prepend-icon="mdi-account"
        title="User Profile"
      >
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Username*"
                required
                v-model="username"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="First name"
                v-model="firstname"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Last name*"
                required
                v-model="lastname"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Email*"
                required
                v-model="email"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Password*"
                type="password"
                required
                v-model="password"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="6">
              <v-text-field
                label="Confirm Password*"
                type="password"
                required
                v-model="confirmPassword"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                label="Age*"
                type="age"
                required
                v-model="age"
              ></v-text-field>
            </v-col>
          </v-row>
          <p
            v-if="message"
            :class="{ 'text-green-600': !isError, 'text-red-600': isError }"
            class="text-center text-base pb-4"
          >
            {{ message }}
          </p>
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
            text="Save"
            variant="tonal"
            @click="register"
          ></v-btn>
        </v-card-actions>
      </v-card>
      <!-- <LottieAnimation v-if="showAnimation" :animationData="animationData" :loop="false" :autoplay="true" /> -->
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const dialog = ref(false);
const age = ref("");
const email = ref("");
const firstname = ref("");
const lastname = ref("");
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const message = ref("");
const showAnimation = ref(false);
const isError = ref(false);

function capitalizeFirstLetter(string) {
  if (typeof string !== 'string' || !string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isEmailValid(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isPasswordValid(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
  return regex.test(password);
}

async function register() {
  if (!isEmailValid(email.value)) {
    message.value = "Invalid email address";
    isError.value = true;
    return;
  }

  if (!isPasswordValid(password.value)) {
    message.value =
      "Password must be at least 8 characters, include an uppercase, a number, and a special character";
    isError.value = true;
    return;
  }

  if (password.value !== confirmPassword.value) {
    message.value = "Passwords do not match";
    isError.value = true;
    return;
  }

  if (age.value < 18) {
	message.value = "You must be at least 18 years old to register";
	isError.value = true;
	return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3005/api/auth/register",
      {
        username: capitalizeFirstLetter(username.value),
        password: password.value,
        email: email.value,
        firstname: capitalizeFirstLetter(firstname.value),
        lastname: capitalizeFirstLetter(lastname.value),
        age: age.value,
      }
    );
    message.value = response.data.message;
    showAnimation.value = true;
    isError.value = false;
    setTimeout(() => {
      dialog.value = false;
    }, 3000);
  } catch (error) {
    message.value = error.response.data.error || "Registration failed";
    isError.value = true;
  }
}
</script>
