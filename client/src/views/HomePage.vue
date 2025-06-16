<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50"
  >
    <template v-if="user">
      <img
        v-if="user.profile_image"
        :src="user.profile_image"
        alt="프로필 이미지"
        class="w-24 h-24 rounded-full object-cover mb-4"
      />
      <p>안녕하세요! {{ user.name }}님</p>
      <p>오늘도 좋은 하루 보내세요 🌿</p>
    </template>
    <p v-else>로딩 중...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const user = ref(authStore.user);

onMounted(async () => {
  if (authStore.token) {
    try {
      const res = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });

      if (!res.ok) throw new Error("사용자 정보 불러오기 실패");

      const data = await res.json();

      // 스토어와 홈의 user 모두 갱신
      authStore.user = data;
      user.value = data;
    } catch (err) {
      console.error(err);
      authStore.logout();
    }
  }
});
</script>
