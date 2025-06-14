<template>
  <div
    class="w-full max-w-[600px] min-h-screen bg-white flex flex-col items-center justify-center p-6 mx-auto"
  >
    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
    >
      <h2 class="text-2xl font-bold mb-6 text-center">회원가입</h2>

      <input
        v-model="name"
        type="text"
        placeholder="이름"
        class="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />

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
        :disabled="loading"
      >
        {{ loading ? "가입 중..." : "회원가입" }}
      </button>

      <!-- 에러 메시지 출력 -->
      <p v-if="error" class="text-red-600 mt-3 text-center">{{ error }}</p>

      <p class="text-center text-sm text-gray-500 mt-4">
        이미 계정이 있나요?
        <router-link to="/login" class="text-blue-600 hover:underline"
          >로그인</router-link
        >
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
const router = useRouter();

async function onSubmit() {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      error.value = data.message || "회원가입 실패";
      loading.value = false;
      return;
    }

    success.value = data.message || "회원가입이 완료되었습니다.";
    loading.value = false;

    // 가입 성공 후 로그인 페이지로 이동
    alert(data.message || "회원가입이 완료되었습니다.");
    loading.value = false;

    router.push("/");
  } catch (err) {
    error.value = "서버 오류가 발생했습니다. 다시 시도해주세요.";
    loading.value = false;
  }
}
</script>
