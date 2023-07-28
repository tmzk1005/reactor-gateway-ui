import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { RoutePaths } from '../utils/pathConstants'

const apiManagementRoutes = {
  path: RoutePaths.mgIndex,
  component: () => import("@/views/mg/Index.vue"),
}

const apiMarketRoutes = {
  path: RoutePaths.mkIndex,
  component: () => import("@/views/mk/Index.vue"),
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: RoutePaths.mgIndex,
      children: [
        apiManagementRoutes,
        apiMarketRoutes
      ]
    },
  ]
})

export default router
