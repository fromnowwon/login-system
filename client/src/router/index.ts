import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/profile", component: ProfilePage },
  { path: "/register", component: RegisterPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 로그인 페이지는 토큰 없이도 접근 가능
  if (to.path === "/login") {
    return next();
  }

  // 토큰 없거나 user 정보 없으면 로그인 페이지로
  if (!authStore.token || !authStore.user) {
    return next("/login");
  }

  next();
});

export default router;
