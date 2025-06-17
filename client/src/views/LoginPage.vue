<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
import { onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

function handleMessage(event: MessageEvent) {
  console.log("Message origin:", event.origin);

  if (event.origin !== import.meta.env.VITE_CLIENT_URL) return;

  if (event.data.type === "google-login-success") {
    const token = event.data.token;
    authStore.token = token;
    localStorage.setItem("token", token);
    authStore.verifyCertificate();

    // 팝업 닫히고 나서 로그인 성공 후 처리
    window.location.href = "/";
  }
}

onMounted(() => {
  window.addEventListener("message", handleMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener("message", handleMessage);
});
</script>
