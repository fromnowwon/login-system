<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <p v-if="user">안녕하세요! {{ user.name }}님</p>
    <p v-else>로딩 중...</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

// 스토어에서 user 가져오기
const user = authStore.user;
</script>
