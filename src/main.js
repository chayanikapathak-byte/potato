import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./style.css";

import Home from "./views/Home.vue";
import Library from "./views/Library.vue";
import Stats from "./views/Stats.vue";

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/library", component: Library, name: "Library" },
  { path: "/stats", component: Stats, name: "Stats" },
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

app.mount("#app");
