<template>
  <a-menu mode="horizontal" theme="dark" v-model:selectedKeys="noUse">
    <a-menu-item>
      <template #icon>
        <gateway-outlined />
      </template>
      <span style="font-weight: bold;">Reactor-Gateway</span>
    </a-menu-item>

    <a-sub-menu style="margin-left: auto">
      <template #icon>
        <user-outlined />
      </template>
      <template #title>NickName</template>
      <a-menu-item>
        <template #icon>
          <cloud-server-outlined />
        </template>
        API市场
      </a-menu-item>
      <a-menu-item>
        <template #icon>
          <info-circle-outlined />
        </template>
        个人信息
      </a-menu-item>
      <a-menu-item v-if="false">
        <template #icon>
          <edit-outlined />
        </template>
        修改密码
      </a-menu-item>
      <a-menu-item v-if="false">
        <template #icon>
          <setting-outlined />
        </template>
        设置
      </a-menu-item>
      <a-menu-item>
        <template #icon>
          <logout-outlined />
        </template>
        退出
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script setup>
import { reactive } from "vue"

import {
  GatewayOutlined, UserOutlined, CloudServerOutlined,
  InfoCircleOutlined, SettingOutlined, LogoutOutlined, EditOutlined
} from "@ant-design/icons-vue"

const noUse = reactive([""])
</script>
