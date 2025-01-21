<template>
  <div class="auth">
    <div class="flex justify-end">
      <LoginDialog />
    </div>
    <div class="flex items-center justify-center"  style="height: 100vh;">
      <RegisterDialog />
    </div>
  </div>
</template>

<script setup>
import RegisterDialog from "~/components/RegisterDialog.vue";
import LoginDialog from "~/components/LoginDialog.vue";
import "../css/auth.css";
</script>
