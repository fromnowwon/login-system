<template>
  <div class="text-center mt-20">로그인 처리중...</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    // JWT 저장 및 인증 상태 갱신
    authStore.token = token;
    localStorage.setItem("token", token);
    authStore.verifyCertificate();

    console.log("Token verified, user authenticated");

    // 부모 창에 메시지 보내기
    if (window.opener) {
      // 부모 창 origin을 정확히 지정
      window.opener.postMessage(
        { type: "google-login-success", token },
        import.meta.env.VITE_CLIENT_URL
      );
      window.close();
    } else {
      // 팝업이 아닌 경우 그냥 홈으로 이동
      window.location.href = "/";
    }
  } else {
    alert("로그인 토큰이 없습니다.");
    window.close();
  }
});
</script>
