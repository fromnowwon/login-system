<template>
  <button
    @click="loginWithGoogle"
    class="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 cursor-pointer"
  >
    <img
      src="/ico_google.svg"
      alt="Google Icon"
      class="w-6 h-6 rounded-full mr-2"
    />
    Google로 로그인
  </button>
</template>

<script setup lang="ts">
const loginWithGoogle = () => {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  window.open(
    url,
    "GoogleLoginPopup",
    `width=${width},height=${height},left=${left},top=${top},status=no,scrollbars=yes,resizable=yes`
  );
};
</script>
