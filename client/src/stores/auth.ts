import { defineStore } from "pinia";

interface User {
  id: number;
  email: string;
  name: string;
  profile_image?: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    // 사용자 인증 확인
    async verifyCertificate() {
      if (!this.token) return;

      try {
        const res = await fetch("api/auth/certificate", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (!res.ok) {
          this.logout();
          return;
        }

        const data = await res.json();
        this.user = data;
      } catch (error) {
        console.error("사용자 정보 불러오기 실패", error);
        this.logout();
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
