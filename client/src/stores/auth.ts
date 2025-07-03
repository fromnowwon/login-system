import { defineStore } from "pinia";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  profile_image?: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("accessToken") || null,
    tokenExpiry: 0, // 토큰 만료시간
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("accessToken", token);

      // JWT 토큰 디코딩해서 만료시간 저장
      const payload = JSON.parse(atob(token.split(".")[1]));
      this.tokenExpiry = payload.exp * 1000;
    },
    async refreshToken() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!res.ok) {
          this.logout();
          return false;
        }

        const data = await res.json();
        this.setToken(data.accessToken);
        return true;
      } catch (error) {
        console.error("토큰 갱신 실패", error);
        this.logout();
        return false;
      }
    },
    isTokenExpiredOrNearExpiry() {
      const now = Date.now();
      // 만료 1분 전부터 만료된 걸로 간주
      return !this.tokenExpiry || now > this.tokenExpiry - 60 * 1000;
    },
    // 사용자 인증 확인
    async verifyCertificate() {
      if (!this.token) return;

      if (this.isTokenExpiredOrNearExpiry()) {
        const refreshed = await this.refreshToken();
        if (!refreshed) return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/certificate`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

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
      localStorage.removeItem("accessToken");
    },
  },
});
