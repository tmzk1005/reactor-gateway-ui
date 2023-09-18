import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { RouteNames, RoutePaths } from '@/utils/pathConstants'
import { useModeStore } from '@/stores/mode'
import { useSessionStore } from '@/stores/session'

const apiManagementRoutes = {
  path: RoutePaths.mgIndex,
  component: () => import("@/views/mg/MgIndex.vue"),
  redirect: RoutePaths.mgDashboard,
  children: [
    {
      path: RoutePaths.mgDashboard,
      component: () => import("@/views/mg/MgDashboard.vue")
    },
    {
      path: RoutePaths.mgOrganization,
      component: () => import("@/views/mg/MgOrganization.vue")
    },
    {
      path: RoutePaths.mgEnvironment,
      component: () => import("@/views/mg/MgEnvironment.vue")
    },
    {
      path: RoutePaths.mgUser,
      component: () => import("@/views/mg/MgUser.vue")
    },
    {
      path: RoutePaths.mgApi,
      component: () => import("@/views/mg/MgApi.vue")
    },
    {
      path: RoutePaths.mgApiCreate,
      component: () => import("@/views/mg/MgApiCreate.vue")
    },
    {
      path: RoutePaths.mgApiUpdate,
      name: RouteNames.mgApiUpdate,
      props: true,
      component: () => import("@/views/mg/MgApiCreate.vue")
    },
    {
      path: RoutePaths.mgApiDetail,
      name: RouteNames.mgApiDetail,
      props: true,
      component: () => import("@/views/mg/MgApiDetail.vue")
    },
    {
      path: RoutePaths.mgAccessLog,
      component: () => import("@/views/common/AccessLog.vue")
    },
    {
      path: RoutePaths.mgMonitor,
      component: () => import("@/views/mg/MonitorAndAlarm.vue")
    },
    {
      path: RoutePaths.mgApiSubscription,
      component: () => import("@/views/mg/ApiSubscription.vue")
    },
    {
      path: RoutePaths.mgMyInfo,
      component: () => import("@/views/common/MyInfo.vue")
    },
    {
      path: RoutePaths.mgPlugin,
      component: () => import("@/views/mg/MgPlugin.vue")
    },
    {
      path: RoutePaths.mgGateway,
      component: () => import("@/views/mg/GatewayNode.vue")
    },
    {
      path: RoutePaths.mgOperations,
      component: () => import("@/views/mg/OperationAudit.vue")
    },
  ]
}

const apiMarketRoutes = {
  path: RoutePaths.mkIndex,
  component: () => import("@/views/mk/MkIndex.vue"),
  redirect: RoutePaths.mkApi,
  children: [
    {
      path: RoutePaths.mkApi,
      component: () => import("@/views/mk/ApiMarket.vue")
    },
    {
      path: RoutePaths.mkUserApp,
      component: () => import("@/views/mk/UserApp.vue")
    },
    {
      path: RoutePaths.mkUserApply,
      component: () => import("@/views/mk/UserApply.vue")
    },
    {
      path: RoutePaths.mkAccessLog,
      component: () => import("@/views/common/AccessLog.vue")
    },
    {
      path: RoutePaths.mkMyInfo,
      component: () => import("@/views/common/MyInfo.vue")
    },
  ]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RoutePaths.mgLogin,
      component: () => import("@/views/mg/MgLogin.vue")
    },
    {
      path: RoutePaths.mkLogin,
      component: () => import("@/views/mk/MkLogin.vue")
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
    {
      path: '/devDebug',
      name: 'devDebug',
      component: () => import("@/views/DevDebug.vue")
    },
  ]
})

const dicideWhereToGo = function (dstPath, loginPath, indexPath) {
  const sessionStore = useSessionStore()
  if (sessionStore.isAuthenticated) {
    return dstPath == loginPath ? { path: indexPath } : true
  }
  return dstPath == loginPath ? true : { path: loginPath }
}

const goToMgPage = function (dstPath) {
  const modeStore = useModeStore()
  modeStore.setModeMg()
  return dicideWhereToGo(dstPath, RoutePaths.mgLogin, RoutePaths.mgIndex)
}

const goToMkPage = function (dstPath) {
  const modeStore = useModeStore()
  modeStore.setModeMk()
  return dicideWhereToGo(dstPath, RoutePaths.mkLogin, RoutePaths.mkIndex)
}

router.beforeEach(async (to) => {
  const dstPath = to.path

  if (dstPath == "/devDebug") {
    return true
  }

  if (dstPath.startsWith(RoutePaths.mgIndex) || dstPath == RoutePaths.mgLogin) {
    return goToMgPage(dstPath)
  } else if (dstPath.startsWith(RoutePaths.mkIndex) || dstPath == RoutePaths.mkLogin) {
    return goToMkPage(dstPath)
  } else if (dstPath == "/") {
    return true
  }
  return { path: "/" }
})

export default router
