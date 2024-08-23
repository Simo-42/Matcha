import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import axios from 'axios';

export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const response = await axios.get('http://localhost:3005/api/jwt/verify-auth', { withCredentials: true });
    console.log('response', response.data); 
    if (!response.data.authenticated) {
      return navigateTo('/auth');
    }
  } catch (error) {
    console.log('Erreur lors de la vérification de l\'authentification', error);
    return navigateTo('/auth');
  }
});
