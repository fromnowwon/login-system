<template>
  <div class="flex justify-center bg-gray-100 min-h-screen">
    <div
      class="w-full max-w-[600px] min-h-screen bg-white flex flex-col relative"
    >
      <Navbar />
      <router-view class="flex-1" />
      <BottomTabs />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import BottomTabs from "@/components/BottomTabs.vue";
</script>
