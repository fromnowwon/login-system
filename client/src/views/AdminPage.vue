<template>
  <div class="p-4 sm:p-8">
    <h1 class="text-xl sm:text-2xl font-bold mb-4">사용자 관리</h1>

    <div class="mb-6 flex flex-col sm:flex-row gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="이름 또는 이메일 검색"
        class="border p-2 rounded w-full sm:w-1/2"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="border rounded-lg p-4 shadow-sm"
      >
        <p class="text-sm"><strong>ID:</strong> {{ user.id }}</p>
        <p class="text-sm"><strong>이메일:</strong> {{ user.email }}</p>

        <div class="mt-2">
          <label class="block text-sm text-gray-600 mb-1">이름</label>
          <input
            v-model="user.name"
            class="text-sm border px-2 py-1 rounded w-full"
          />
        </div>

        <div class="mt-2">
          <label class="block text-sm text-gray-600 mb-1">권한</label>
          <select
            v-model="user.role"
            class="text-sm border px-2 py-1 rounded w-full"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <div class="mt-4 flex gap-2 justify-between">
          <button
            class="text-sm text-white px-3 py-1 rounded bg-black whitespace-nowrap"
            @click="updateUser(user)"
          >
            저장
          </button>
          <button
            class="text-sm text-black px-3 py-1 rounded border border black whitespace-nowrap"
            @click="deleteUser(user.id)"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const users = ref<any[]>([]);
const searchQuery = ref("");

const fetchUsers = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });

  if (res.ok) {
    users.value = await res.json();
  } else {
    console.error("유저 목록 불러오기 실패");
  }
};

const updateUser = async (user: any) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/admin/users/${user.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        role: user.role,
      }),
    }
  );

  if (!res.ok) {
    alert("수정 실패");
    return;
  }

  alert("수정 완료");
};

const deleteUser = async (id: number) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/admin/users/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    }
  );

  if (!res.ok) {
    alert("삭제 실패");
    return;
  }

  users.value = users.value.filter((u) => u.id !== id);
  alert("삭제 완료");
};

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const keyword = searchQuery.value.toLowerCase();
    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });
});

onMounted(() => {
  fetchUsers();
});
</script>
