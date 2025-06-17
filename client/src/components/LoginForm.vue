<template>
  <form
    @submit.prevent="onSubmit"
    class="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
  >
    <h2 class="text-2xl font-bold mb-6 text-center">로그인</h2>

    <input
      v-model="email"
      type="email"
      placeholder="이메일"
      class="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />

    <input
      v-model="password"
      type="password"
      placeholder="비밀번호"
      class="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />

    <button
      type="submit"
      class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition cursor-pointer"
    >
      로그인
    </button>

    <p class="text-center text-sm text-gray-500 mt-4">
      아직 계정이 없나요?
      <router-link to="/register" class="text-blue-600 hover:underline"
        >회원가입</router-link
      >
    </p>

    <div class="mt-6">
      <GoogleLoginButton />
    </div>
  </form>
</template>

<script setup lang="ts">
import GoogleLoginButton from "@/components/GoogleLoginButton.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();

const authStore = useAuthStore();

const email = ref("");
const password = ref("");

async function onSubmit() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("로그인 실패");
    }

    const data = await response.json();

    // 로그인 성공 시 토큰을 로컬 스토리지에 저장
    localStorage.setItem("token", data.token);

    // authStore에 토큰과 사용자 정보를 저장
    authStore.token = data.token;
    authStore.user = data.user ?? null;

    router.push("/");
  } catch (error) {
    alert("로그인에 실패했습니다. 다시 시도해주세요.");
  }
}
</script>
