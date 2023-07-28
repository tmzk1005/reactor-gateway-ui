import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { RoutePaths } from '../utils/pathConstants'

const apiManagementRoutes = {
  path: RoutePaths.mgIndex,
  component: () => import("@/views/mg/MgIndex.vue"),
  redirect: RoutePaths.mgDashboard,
  children: [
    {
      path: RoutePaths.mgDashboard,
      component: () => import("@/views/mg/MgDashboard.vue")
    },
  ]
}

const apiMarketRoutes = {
  path: RoutePaths.mkIndex,
  component: () => import("@/views/mk/MkIndex.vue"),
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RoutePaths.mgLogin,
      component: () => import("@/views/mg/MgLogin.vue")
    },
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
