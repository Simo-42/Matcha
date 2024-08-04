<template> 
  <div class="Auth-form">
    <h2>Connexion</h2>
    <form @submit.prevent="Auth">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" required />
      </div>
   
      <button type="submit">Auth</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const username = ref('');
const password = ref('');
const message = ref('');

const Auth = () => { // Ici la fonction pour axios 
  message.value = "Registration logic will be implemented here.";
};
</script>

<style scoped>
.Auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.Auth-form div {
  margin-bottom: 1em;
}
.Auth-form label {
  margin-bottom: .5em;
  color: #333333;
  display: block;
}
.Auth-form input {
  border: 1px solid #CCCCCC;
  padding: .5em;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}
.Auth-form button {
  padding: 0.7em;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.Auth-form button:hover {
  background-color: #0056b3;
}
.Auth-form p {
  margin-top: 1em;
  color: green;
}
</style>
