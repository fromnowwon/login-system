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
      class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
    >
      로그인
    </button>

    <p class="text-center text-sm text-gray-500 mt-4">
      아직 계정이 없나요?
      <router-link to="/register" class="text-blue-600 hover:underline"
        >회원가입</router-link
      >
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");

function onSubmit() {
  console.log("로그인 시도", email.value, password.value);
}
</script>
