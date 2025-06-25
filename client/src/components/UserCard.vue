<template>
  <div class="border rounded-lg p-4 shadow-sm">
    <p class="text-sm"><strong>ID:</strong> {{ user.id }}</p>
    <p class="text-sm"><strong>이메일:</strong> {{ user.email }}</p>

    <div class="mt-2">
      <label class="block text-sm text-gray-600 mb-1">이름</label>
      <input
        v-model="editableUser.name"
        class="text-sm border px-2 py-1 rounded w-full"
      />
    </div>

    <div class="mt-2">
      <label class="block text-sm text-gray-600 mb-1">권한</label>
      <select
        v-model="editableUser.role"
        class="text-sm border px-2 py-1 rounded w-full"
      >
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
    </div>

    <div class="mt-4 flex gap-2 justify-between">
      <button
        class="text-sm text-white px-3 py-1 rounded bg-black whitespace-nowrap"
        @click="$emit('update', editableUser)"
      >
        저장
      </button>
      <button
        class="text-sm text-black px-3 py-1 rounded border whitespace-nowrap"
        @click="$emit('delete', user.id)"
      >
        삭제
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

const props = defineProps<{
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}>();

defineEmits(["update", "delete"]);

const editableUser = reactive({ ...props.user });

watch(
  () => props.user,
  (newVal) => {
    Object.assign(editableUser, newVal);
  }
);
</script>
