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

  if ((to.path === "/login" || to.path === "/register") && authStore.token) {
    // 토큰이 있고 user가 있을 때만 홈으로 리다이렉트
    if (authStore.user) {
      alert("이미 로그인되어 있습니다.");
      return next("/");
    }
  }

  if (!authStore.token && to.path !== "/login" && to.path !== "/register") {
    return next("/login");
  }

  next();
});

app.mount("#app");
