<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">관리자 페이지</h1>

    <div v-if="isAdmin">
      <p class="text-green-600">관리자 권한이 확인되었습니다!</p>
    </div>

    <div v-else>
      <p class="text-red-600">⛔ 관리자 권한이 없습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const isAdmin = computed(() => authStore.user?.role === "admin");

// 페이지 진입 시 한번 더 확인
if (!isAdmin.value) {
  alert("관리자만 접근 가능합니다.");
  router.push("/");
}
</script>
