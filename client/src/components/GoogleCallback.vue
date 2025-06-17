<template>
  <div class="text-center mt-20">구글 로그인 처리중...</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const code = route.query.code;

if (code) {
  fetch("/api/auth/google/callback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        // 부모 창으로 토큰 전달
        window.opener.postMessage(
          {
            type: "google-login-success",
            token: data.token,
            user: data.user,
          },
          window.location.origin
        );
        // 팝업 닫기
        window.close();
      } else {
        alert("구글 로그인 실패");
        window.close();
      }
    })
    .catch((err) => {
      console.error(err);
      alert("구글 로그인 오류");
      window.close();
    });
} else {
  alert("code가 없습니다");
  window.close();
}
</script>
