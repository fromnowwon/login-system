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

  if (to.meta.requiresAuth) {
    // 인증 필요한 페이지인데 토큰 없으면 로그인으로
    if (!authStore.token) {
      return next("/login");
    }
  }

  // 로그인/회원가입 페이지 접근 시 이미 로그인되어 있으면 홈으로
  if ((to.path === "/login" || to.path === "/register") && authStore.token) {
    alert("이미 로그인되어 있습니다.");
    return next("/");
  }

  // 토큰 없으면 로그인 페이지로
  if (!authStore.token) {
    return next("/login");
  }

  next();
});

app.mount("#app");
