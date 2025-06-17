<template>
  <div class="w-full bg-white rounded shadow p-6 mt-8">
    <h2 class="text-2xl font-bold mb-6 text-center">내 프로필</h2>

    <div class="flex flex-col items-center mb-6">
      <img
        v-if="user?.profile_image"
        :src="user.profile_image"
        alt="프로필 이미지"
        class="w-32 h-32 rounded-full object-cover"
      />
      <div
        v-else
        class="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600"
      >
        No Image
      </div>

      <div class="flex items-center mt-1">
        <input
          id="profile-upload"
          type="file"
          name="profile_image"
          @change="handleImageUpload"
          class="hidden"
        />
        <label
          for="profile-upload"
          class="inline-block p-2 text-blue-600 text-sm underline cursor-pointer"
        >
          변경
        </label>

        <button
          v-if="user?.profile_image"
          @click="deleteProfileImage"
          class="inline-block p-2 text-sm underline cursor-pointer"
        >
          삭제
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div v-if="user">
        <label class="block font-semibold mb-1">이름</label>
        <p class="text-lg">{{ user.name }}</p>
      </div>

      <div v-if="user">
        <label class="block font-semibold mb-1">이메일</label>
        <p class="text-lg">{{ user.email }}</p>
      </div>

      <div v-if="user?.created_at">
        <label class="block font-semibold mb-1">가입일</label>
        <p class="text-lg">{{ formatDate(user.created_at) }}</p>
      </div>
    </div>

    <div class="mt-7 text-center">
      <router-link
        to="/edit-profile"
        class="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        정보 수정
      </router-link>

      <button class="inline-block mt-2 p-2 underline" @click="confirmDelete">
        회원 탈퇴
      </button>
    </div>

    <!-- 탈퇴 확인 모달 -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-60"
    >
      <div class="bg-white p-6 rounded shadow max-w-sm w-full">
        <p class="mb-4">
          정말로 회원 탈퇴 하시겠습니까? <br />이 작업은 되돌릴 수 없습니다.
        </p>
        <button
          @click="deleteAccount"
          class="bg-red-600 text-white px-4 py-2 rounded mr-2 cursor-pointer"
        >
          탈퇴하기
        </button>
        <button
          @click="showModal = false"
          class="px-4 py-2 border rounded cursor-pointer"
        >
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const showModal = ref(false);

interface UserProfile {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
  created_at?: string;
}

const user = ref<UserProfile | null>(null);

const confirmDelete = () => {
  showModal.value = true;
};

const deleteAccount = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "회원 탈퇴 실패");
    }

    alert("회원 탈퇴가 완료되었습니다.");
    authStore.logout();
    router.push("/login");
  } catch (error) {
    alert(error instanceof Error ? error.message : "오류가 발생했습니다.");
  } finally {
    showModal.value = false;
  }
};

const handleImageUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("profile_image", file);

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/profile-image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) throw new Error("이미지 업로드 실패");

    const data = await res.json();

    if (user.value) {
      user.value.profile_image = data.imageUrl;
    }

    alert("프로필 이미지가 업데이트되었습니다!");
  } catch (err) {
    console.error(err);
    alert(err instanceof Error ? err.message : "이미지 업로드 오류");
  }
};

const deleteProfileImage = async () => {
  if (!confirm("정말로 프로필 이미지를 삭제하시겠습니까?")) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/profile-image`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (!res.ok) throw new Error("이미지 삭제 실패");

    if (user.value) {
      user.value.profile_image = undefined;
    }

    alert("프로필 이미지가 삭제되었습니다.");
  } catch (err) {
    console.error(err);
    alert(err instanceof Error ? err.message : "이미지 삭제 오류");
  }
};

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (!res.ok) throw new Error("프로필 로드 실패");

    const data = await res.json();

    user.value = {
      id: data.id,
      name: data.name,
      email: data.email,
      profile_image: data.profile_image,
      created_at: data.created_at,
    };
  } catch (err) {
    console.error(err);
    // 토큰이 만료되었거나 서버 오류일 경우 로그아웃
    authStore.logout();
    router.push("/login");
  }
});

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>
