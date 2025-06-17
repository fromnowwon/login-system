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
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // 토큰이 있지만 유저 정보 없으면 복원 시도
  if (authStore.token && !authStore.user) {
    await authStore.verifyCertificate();
  }

  // 로그인/회원가입 페이지 진입 방지
  if (
    (to.path === "/login" || to.path === "/register") &&
    authStore.token &&
    authStore.user
  ) {
    alert("이미 로그인되어 있습니다.");
    return next("/");
  }

  // 로그인 안 했는데 보호된 페이지면 로그인으로
  if (
    !authStore.token &&
    !["/login", "/register", "/login-success"].includes(to.path)
  ) {
    return next("/login");
  }

  next();
});
app.mount("#app");
