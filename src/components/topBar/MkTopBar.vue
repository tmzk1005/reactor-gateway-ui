<template>
  <a-menu mode="horizontal" theme="light" v-model:selectedKeys="noUse">
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
      <template #title>{{ nickname }}</template>

      <a-menu-item @click="router.push(RoutePaths.mgIndex)">
        <template #icon>
          <gateway-outlined />
        </template>
        API管理平台
      </a-menu-item>

      <a-menu-item>
        <template #icon>
          <info-circle-outlined />
        </template>
        个人信息
      </a-menu-item>

      <a-menu-item @click="onLogout">
        <template #icon>
          <logout-outlined />
        </template>
        退出
      </a-menu-item>

    </a-sub-menu>
  </a-menu>
</template>

<script setup>
import { reactive, ref } from "vue"
import { UserService } from "@/services/userService"
import { useRouter } from "vue-router"
import { RoutePaths } from "@/utils/pathConstants"
import { useSessionStore } from "@/stores/session"

import {
  GatewayOutlined, UserOutlined,
  InfoCircleOutlined, LogoutOutlined
} from "@ant-design/icons-vue"

const nickname = ref("未登录")

const noUse = reactive([""])
const router = useRouter()

const onLogout = function () {
  UserService.logout().then(() => {
    router.push(RoutePaths.mkLogin)
  })
}

const setNickName = () => {
  nickname.value = useSessionStore().userInfo.nickname
}

setNickName()

</script>
