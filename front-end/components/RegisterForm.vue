<template> 
  <div class="register-form">
    <h2>Register</h2>
    <form @submit.prevent="register">
          <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" maxlength="20" required />
        <small v-if="password.length >= 20" class="text-red-500">Password cannot exceed 20 characters.</small>
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'

const email = ref(''); // recup la valeur avec value
const password = ref('');
const message = ref('');

const register = async () => { // Ici la fonction pour axios 
	message.value = "Registration logic will be implemented here.";
  	if (password.value.length > 25) {
    	message.value = 'Password cannot exceed 20 characters.';
    	return;
  	}
	try 
	{
		const response = await axios.post('http://localhost:3000/api/auth/register', {
			email : email.value,
			password: password.value
		});
		message.value = response.data.message;
	} catch (error)
	{
		message.value = error.reponse.data.error || 'Registration failed';
	}
  
};



</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.register-form div {
  margin-bottom: 1em;
}
.register-form label {
  margin-bottom: .5em;
  color: #333333;
  display: block;
}
.register-form input {
  border: 1px solid #CCCCCC;
  padding: .5em;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}
.register-form button {
  padding: 0.7em;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.register-form button:hover {
  background-color: #0056b3;
}
.register-form p {
  margin-top: 1em;
  color: green;
}
</style>
