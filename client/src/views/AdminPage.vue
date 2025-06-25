<template>
  <div class="p-4 sm:p-8">
    <h1 class="text-xl sm:text-2xl font-bold mb-4">사용자 관리</h1>

    <UserSearchInput v-model="searchQuery" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
      <UserCard
        v-for="user in filteredUsers"
        :key="user.id"
        :user="user"
        @update="updateUser"
        @delete="deleteUser"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import UserCard from "@/components/UserCard.vue";
import UserSearchInput from "@/components/UserSearchInput.vue";
import type { User } from "@/types/User";

const authStore = useAuthStore();
const users = ref<User[]>([]);
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

  if (!res.ok) return alert("수정 실패");
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

  if (!res.ok) return alert("삭제 실패");

  users.value = users.value.filter((u) => u.id !== id);
  alert("삭제 완료");
};

const filteredUsers = computed(() =>
  users.value.filter((user) => {
    const keyword = searchQuery.value.toLowerCase();
    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  })
);

onMounted(fetchUsers);
</script>
