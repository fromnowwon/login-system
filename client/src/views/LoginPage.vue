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
  // 허용할 origin 리스트
  const allowedOrigins = [
    import.meta.env.VITE_CLIENT_URL, // 프론트 배포 URL
    import.meta.env.VITE_API_URL, // 백엔드 URL
    window.location.origin, // 현재 창 origin (로컬 개발 시)
  ];

  if (!allowedOrigins.includes(event.origin)) {
    console.warn(`Blocked message from disallowed origin: ${event.origin}`);
    return;
  }

  if (event.data.type === "google-login-success") {
    const token = event.data.token;
    authStore.token = token;
    localStorage.setItem("accessToken", token);

    // 로그인 직전 기존 유저 정보 초기화
    authStore.user = null;

    // 사용자 정보 갱신
    authStore.verifyCertificate();

    // 로그인 성공 후 리다이렉트
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
