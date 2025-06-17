<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginForm from "@/components/LoginForm.vue";

const authStore = useAuthStore();
const router = useRouter();

function handleMessage(event: MessageEvent) {
  if (event.origin !== window.location.origin) return;
  const data = event.data;
  if (data.type === "google-login-success") {
    authStore.token = data.token;
    authStore.user = data.user;
    localStorage.setItem("token", data.token);
    authStore.verifyCertificate();
    router.push("/");
  }
}

onMounted(() => {
  window.addEventListener("message", handleMessage);
});

onUnmounted(() => {
  window.removeEventListener("message", handleMessage);
});
</script>
