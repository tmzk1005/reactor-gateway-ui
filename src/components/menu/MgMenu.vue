<template>
  <a-menu theme="dark" mode="inline">
    <a-menu-item key="dashboard" @click="goToPage(RoutePaths.mgDashboard)">
      <area-chart-outlined />
      <span>仪表板</span>
    </a-menu-item>

    <a-sub-menu>
      <template #title>
        <api-outlined />
        <span><code>API管理</code></span>
      </template>

      <a-menu-item key="api" @click="goToPage(RoutePaths.mgApi)">
        <api-outlined />
        <span><code>API查看</code></span>
      </a-menu-item>

      <a-menu-item key="apiCreate" @click="goToPage(RoutePaths.mgApiCreate)" v-if="sessionStore.isNormalUser">
        <plus-circle-outlined />
        <span><code>新建API</code></span>
      </a-menu-item>

      <a-menu-item key="apiSubscription" @click="goToPage(RoutePaths.mgApiSubscription)">
        <delivered-procedure-outlined />
        <span>订阅申请</span>
      </a-menu-item>
    </a-sub-menu>

    <a-menu-item key="accessLog" @click="goToPage(RoutePaths.mgAccessLog)">
      <snippets-outlined />
      <span>访问日志</span>
    </a-menu-item>

    <a-menu-item key="monitor" @click="goToPage(RoutePaths.mgMonitor)">
      <snippets-outlined />
      <span>监控告警</span>
    </a-menu-item>

    <a-menu-item key="environment" @click="goToPage(RoutePaths.mgEnvironment)">
      <environment-outlined />
      <span>环境</span>
    </a-menu-item>

    <a-menu-item key="apiPlugin" @click="goToPage(RoutePaths.mgPlugin)">
      <usb-outlined />
      <span><code>API</code>插件</span>
    </a-menu-item>

    <a-menu-item key="userInfo" @click="goToPage(RoutePaths.mgMyInfo)">
      <user-outlined />
      <span>我的信息</span>
    </a-menu-item>

    <a-menu-item key="user" v-if="sessionStore.isSystemAdmin || sessionStore.isOrgAdmin"
      @click="goToPage(RoutePaths.mgUser)">
      <team-outlined />
      <span>用户管理</span>
    </a-menu-item>

    <a-menu-item key="organization" v-if="sessionStore.isSystemAdmin" @click="goToPage(RoutePaths.mgOrganization)">
      <group-outlined />
      <span>组织管理</span>
    </a-menu-item>

    <a-menu-item key="operations" v-if="sessionStore.isSystemAdmin" @click="goToPage(RoutePaths.mgOperations)">
      <audit-outlined />
      <span>操作审计</span>
    </a-menu-item>

    <a-menu-item key="gatewayNode" v-if="sessionStore.isSystemAdmin" @click="goToPage(RoutePaths.mgGateway)">
      <cluster-outlined />
      <span>网关节点</span>
    </a-menu-item>

  </a-menu>
</template>

<script setup>
import {
  ApiOutlined, AreaChartOutlined, DeliveredProcedureOutlined, TeamOutlined, GroupOutlined, AuditOutlined,
  SnippetsOutlined, UserOutlined, UsbOutlined, EnvironmentOutlined, ClusterOutlined, PlusCircleOutlined
} from '@ant-design/icons-vue'

import { useSessionStore } from "@/stores/session"
import { useRouter } from "vue-router"
import { RoutePaths } from "@/utils/pathConstants"

const sessionStore = useSessionStore()
const router = useRouter()

const goToPage = (dstPath) => {
  router.push(dstPath)
}
</script>