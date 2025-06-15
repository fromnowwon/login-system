<template>
  <div class="w-full bg-white rounded shadow p-6 mt-8">
    <h2 class="text-2xl font-bold mb-6 text-center">프로필 수정</h2>

    <form @submit.prevent="updateProfile" class="flex flex-col gap-4">
      <div>
        <label class="block font-semibold mb-1">이름</label>
        <input
          v-model="name"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="이름을 입력하세요"
          required
        />
      </div>

      <div>
        <label class="block font-semibold mb-1">이메일</label>
        <input
          v-model="email"
          type="email"
          class="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="이메일을 입력하세요"
          required
        />
      </div>

      <div class="mt-10 text-center">
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          저장하기
        </button>

        <router-link to="/profile" class="inline-block mt-3 p-2"
          >취소</router-link
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");

// 기존 프로필 정보 불러오기
onMounted(() => {
  if (authStore.user) {
    name.value = authStore.user.name;
    email.value = authStore.user.email;
  }
});

// 프로필 정보 수정 요청
const updateProfile = async () => {
  try {
    const res = await fetch("/api/user/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "프로필 수정 실패");
    }

    // 서버 응답이 성공적이면 authStore의 user 정보 업데이트
    authStore.user = {
      ...authStore.user!,
      name: name.value,
      email: email.value,
    };

    alert("프로필이 성공적으로 수정되었습니다.");
    router.push("/profile");
  } catch (error) {
    console.error(error);
    alert(
      error instanceof Error ? error.message : "수정 중 오류가 발생했습니다."
    );
  }
};
</script>
