<template>
  <div class="flex justify-center bg-gray-100 min-h-screen">
    <div
      class="w-full max-w-[600px] min-h-screen bg-white flex flex-col relative"
    >
      <Navbar v-if="showNavbar" />
      <router-view class="flex-1" />
      <BottomTabs v-if="showBottomTabs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import Navbar from "@/components/Navbar.vue";
import BottomTabs from "@/components/BottomTabs.vue";

const route = useRoute();
const authStore = useAuthStore();

const hiddenPaths = ["/login", "/register", "/auth/google/callback"];

const showNavbar = computed(() => {
  return !hiddenPaths.includes(route.path);
});

const showBottomTabs = computed(() => {
  return !hiddenPaths.includes(route.path);
});

// 앱 진입 시 인증 확인
onMounted(() => {
  authStore.verifyCertificate();
});
</script>
