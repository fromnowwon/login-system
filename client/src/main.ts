import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "./stores/auth";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// 라우터 가드 설정
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 토큰이 있으면 유저 정보 복원 시도
  if (authStore.token && !authStore.user) {
    await authStore.verifyCertificate();
  }

  if (to.path === "/login" || to.path === "/register") {
    // 이미 로그인된 상태면 홈으로 리다이렉트
    if (authStore.token && authStore.user) {
      alert("이미 로그인되어 있습니다.");
      return next("/");
    }

    return next();
  }

  // 토큰 없으면 로그인 페이지로
  if (!authStore.token) {
    return next("/login");
  }

  next();
});

app.mount("#app");
