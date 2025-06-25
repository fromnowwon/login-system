<template>
  <div class="mb-6 flex flex-col sm:flex-row gap-2">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="이름 또는 이메일 검색"
      class="border p-2 rounded w-full sm:w-1/2"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

defineEmits(["update:modelValue"]);
</script>
