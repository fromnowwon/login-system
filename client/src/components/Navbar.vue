<template>
  <header
    class="w-full bg-white shadow-md p-4 flex items-center justify-between relative"
  >
    <router-link
      to="/"
      class="text-gray-700 hover:text-blue-600"
      @click="closeMenu"
    >
      <h1 class="text-xl font-bold">MyApp</h1>
    </router-link>

    <button @click="toggleMenu" class="focus:outline-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute top-full right-4 mt-2 w-40 bg-white shadow-lg rounded-lg z-50"
    >
      <nav class="flex flex-col px-4 py-2 space-y-2">
        <router-link
          to="/"
          class="text-gray-700 hover:text-blue-600"
          @click="closeMenu"
          >홈</router-link
        >
        <button
          @click="goAdmin"
          class="text-left text-gray-700 hover:text-blue-600 cursor-pointer"
        >
          관리자 페이지
        </button>
        <button
          @click="goProfile"
          class="text-left text-gray-700 hover:text-blue-600 cursor-pointer"
        >
          마이페이지
        </button>

        <button
          v-if="!authStore.token"
          @click="goLogin"
          class="text-left text-gray-700 hover:text-blue-600 cursor-pointer"
        >
          로그인
        </button>
        <button
          v-else
          @click="logout"
          class="text-left text-gray-700 hover:text-blue-600 cursor-pointer"
        >
          로그아웃
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
const closeMenu = () => {
  isOpen.value = false;
};

const goLogin = () => {
  closeMenu();
  router.push("/login");
};

const logout = () => {
  authStore.logout();
  closeMenu();
  router.push("/login");
};

const goAdmin = () => {
  closeMenu();
  if (authStore.user?.role !== "admin") {
    alert("관리자 권한이 필요합니다.");
  } else {
    router.push("/admin");
  }
};

const goProfile = () => {
  closeMenu();
  if (!authStore.token) {
    alert("로그인이 필요합니다.");
    router.push("/login");
  } else {
    router.push("/profile");
  }
};
</script>
