import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import EditProfilePage from "@/views/EditProfilePage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import GoogleLoginSuccessPage from "@/views/GoogleLoginSuccessPage.vue";
import AdminPage from "@/views/AdminPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  {
    path: "/profile",
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-profile",
    component: EditProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/login-success",
    alias: ["/login-success/"],
    name: "GoogleLoginSuccess",
    component: GoogleLoginSuccessPage,
  },
  {
    path: "/admin",
    component: AdminPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
