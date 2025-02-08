<template>
  <div class="auth-container">
    <div class="flex justify-end">
      <LoginDialog />
    </div>
    <div id="auth" class="flex flex-col justify-center items-center" style="height: 100vh;">
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

<style scoped>
.auth-container {
  height: 100vh;
  width: 100vw;
}
</style>
