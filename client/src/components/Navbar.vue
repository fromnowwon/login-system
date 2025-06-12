<template>
  <header
    class="w-full bg-white shadow-md p-4 flex items-center justify-between relative"
  >
    <router-link
      to="/"
      class="text-gray-700 hover:text-blue-600"
      @click="closeMenu"
      ><h1 class="text-xl font-bold">MyApp</h1></router-link
    >

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
        <router-link
          to="/profile"
          class="text-gray-700 hover:text-blue-600"
          @click="closeMenu"
          >마이페이지</router-link
        >
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isOpen = ref(false);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
const closeMenu = () => {
  isOpen.value = false;
};
</script>
