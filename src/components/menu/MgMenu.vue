<template>
  <a-menu theme="dark" mode="inline">
    <a-menu-item key="dashboard">
      <area-chart-outlined />
      <span>仪表板</span>
    </a-menu-item>

    <a-menu-item key="api">
      <api-outlined />
      <span><code>API</code></span>
    </a-menu-item>

    <a-menu-item key="accessLog">
      <snippets-outlined />
      <span>网关访问日志</span>
    </a-menu-item>

    <a-menu-item key="apiApplyApprove">
      <delivered-procedure-outlined />
      <span><code>API</code>访问申请</span>
    </a-menu-item>

    <a-menu-item key="environment">
      <environment-outlined />
      <span>环境</span>
    </a-menu-item>

    <a-menu-item key="apiPlugin">
      <usb-outlined />
      <span><code>API</code>插件</span>
    </a-menu-item>

    <a-menu-item key="userInfo">
      <user-outlined />
      <span>我的信息</span>
    </a-menu-item>
  </a-menu>
</template>

<script setup>
import {
  ApiOutlined, AreaChartOutlined, DeliveredProcedureOutlined,
  SnippetsOutlined, UserOutlined, UsbOutlined, EnvironmentOutlined
} from '@ant-design/icons-vue'
</script>