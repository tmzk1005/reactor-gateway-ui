<template>
  <a-menu theme="light" mode="inline">
    <a-menu-item key="apiMarket">
      <area-chart-outlined />
      <span>API市场</span>
    </a-menu-item>

    <a-menu-item key="app">
      <appstore-outlined />
      <span>我的应用</span>
    </a-menu-item>

    <a-menu-item key="apiApply">
      <delivered-procedure-outlined />
      <span>我的申请</span>
    </a-menu-item>

    <a-menu-item key="user">
      <user-outlined />
      <span>我的信息</span>
    </a-menu-item>
  </a-menu>
</template>

<script setup>
import { AreaChartOutlined, AppstoreOutlined, UserOutlined, DeliveredProcedureOutlined } from '@ant-design/icons-vue'
</script>