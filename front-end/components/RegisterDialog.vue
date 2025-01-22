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
  
		<v-card @submit.prevent="register" prepend-icon="mdi-account" title="User Profile">
		  <v-card-text> 
			<v-row dense>
			  <v-col cols="12" md="4" sm="6">
				<v-text-field label="Username*" required v-model="username"></v-text-field>
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
				<v-text-field label="Email*" required v-model="email"></v-text-field>
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
				></v-text-field>
			  </v-col>
  
			  <v-col cols="12" sm="6">
				<v-select
				  type="age"
				  label="Age*"
				  required
				></v-select>
			  </v-col>
  
			  <!-- <v-col cols="12" sm="6">
				<v-autocomplete
				  :items="[
					'Skiing',
					'Ice hockey',
					'Soccer',
					'Basketball',
					'Hockey',
					'Reading',
					'Writing',
					'Coding',
					'Basejump',
				  ]"
				  label="Interests"
				  auto-select-first
				  multiple
				></v-autocomplete> -->
			  <!-- </v-col> -->
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
			  text="Save"
			  variant="tonal"
			  @click="register"
			></v-btn>
		  </v-card-actions>
		  <p v-if="message" :class="{'text-green-600': !isError, 'text-red-600': isError}" class="text-center text-base pb-4">{{ message }}</p>
		</v-card>
		<LottieAnimation v-if="showAnimation" :animationData="animationData" :loop="false" :autoplay="true" />
	  </v-dialog>
	</div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import LottieAnimation from "~/components/lotie/lotie_animation.vue";
  import animationData from "~/assets/lottie/valide.json"; 
  
  const dialog = ref(false);
  const age = ref("");
  const email = ref("");
  const firstname = ref("");
  const lastname = ref("");
  const username = ref("");
  const password = ref("");
  const message = ref("");
  const showAnimation = ref(false);
  const isError = ref(false);
  
  async function register() {
	try {
	  const response = await axios.post(
		"http://localhost:3005/api/auth/register",
		{
		  username: username.value,
		  password: password.value,
		  email: email.value,
		  firstname: firstname.value,
		  lastname: lastname.value,
		  age: age.value,
		},
	  );
		dialog.value = false;
		message.value = response.data.message;
		showAnimation.value = true;
		isError.value = false;
		setTimeout(() => {
		  navigateTo("/auth");
		}, 3000);
	} catch (error) {
		message.value = error.response.data.error || "Registration failed";
		isError.value = true;
	}
}
  </script>
