import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./style.css";

import Home from "./views/Home.vue";
import Library from "./views/Library.vue";
import Stats from "./views/Stats.vue";
import Login from "./views/Login.vue";
import Signup from "./views/Signup.vue";
import Profile from "./views/Profile.vue";
import { useAuthStore } from "./stores/auth";

const routes = [
  { path: "/", component: Home, name: "Home", meta: { requiresAuth: true } },
  { path: "/library", component: Library, name: "Library", meta: { requiresAuth: true } },
  { path: "/stats", component: Stats, name: "Stats", meta: { requiresAuth: true } },
  { path: "/profile", component: Profile, name: "Profile", meta: { requiresAuth: true } },
  { path: "/login", component: Login, name: "Login", meta: { guest: true } },
  { path: "/signup", component: Signup, name: "Signup", meta: { guest: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

app.mount("#app");
