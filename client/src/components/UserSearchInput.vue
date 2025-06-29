<template>
  <div class="mb-6 flex flex-col sm:flex-row gap-2">
    <input
      :value="modelValue"
      @input="handleInput"
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

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>
