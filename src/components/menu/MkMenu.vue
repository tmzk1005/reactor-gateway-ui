<template>
  <a-menu theme="light" mode="inline">
    <a-menu-item key="apiMarket" @click="goToPage(RoutePaths.mkApi)">
      <area-chart-outlined />
      <span><code>API</code>市场</span>
    </a-menu-item>

    <a-menu-item key="app" @click="goToPage(RoutePaths.mkUserApp)">
      <appstore-outlined />
      <span>我的应用</span>
    </a-menu-item>

    <a-menu-item key="apiApply" @click="goToPage(RoutePaths.mkUserApply)">
      <delivered-procedure-outlined />
      <span>我的申请</span>
    </a-menu-item>

    <a-menu-item key="accessLog" @click="goToPage(RoutePaths.mkAccessLog)">
      <snippets-outlined />
      <span>访问日志</span>
    </a-menu-item>

    <a-menu-item key="user" @click="goToPage(RoutePaths.mkMyInfo)">
      <user-outlined />
      <span>我的信息</span>
    </a-menu-item>
  </a-menu>
</template>

<script setup>
import { AreaChartOutlined, AppstoreOutlined, UserOutlined, DeliveredProcedureOutlined, SnippetsOutlined } from '@ant-design/icons-vue'
import { RoutePaths } from "@/utils/pathConstants"
import { useRouter } from "vue-router"

const router = useRouter()

const goToPage = (dstPath) => {
  router.push(dstPath)
}
</script>