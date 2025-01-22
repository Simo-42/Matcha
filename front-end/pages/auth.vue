<template>
  <div class="auth">
    <div class="flex justify-end">
      <LoginDialog />
    </div>
    <div class="flex flex-col justify-center items-center" style="height: 100vh;">
      <div class="text-center ">
        <p>Swipe Right™</p>
      </div>
      <RegisterDialog />
    </div>
  </div>
</template>

<script setup>
import RegisterDialog from "~/components/RegisterDialog.vue";
import LoginDialog from "~/components/LoginDialog.vue";
import "../css/auth.css";
</script>
