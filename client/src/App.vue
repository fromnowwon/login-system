<template>
  <div class="flex justify-center bg-gray-100 min-h-screen">
    <div
      class="w-full max-w-[600px] min-h-screen bg-white flex flex-col relative"
    >
      <Navbar />
      <router-view class="flex-1" />
      <BottomTabs v-if="showBottomTabs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import BottomTabs from "@/components/BottomTabs.vue";

const route = useRoute();

const showBottomTabs = computed(() => {
  return !["/login", "/register"].includes(route.path);
});
</script>
