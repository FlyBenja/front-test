import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import LoginPage from './views/LoginPage.vue';
import DetallePage from './views/DetallePage.vue';

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/login', name: 'LoginPage', component: LoginPage },
  { path: '/detalle', name: 'DetallePage', component: DetallePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;