<template>
  <a-row style="margin-top: 150px">
    <a-col :offset="12" :span="6">
      <span style="font-size: 2rem; float: right">API市场-登录</span>
    </a-col>
  </a-row>
  <a-row>
    <a-col :offset="12" :span="6" style="margin-top: 30px">
      <a-form v-model="userInfo" :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
        <a-form-item ref="username" label="用户名" name="username">
          <a-input v-model:value="userInfo.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item has-feedback label="密码" name="password">
          <a-input
            v-model:value="userInfo.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24, offset: 4 }">
          <a-typography-text :type="loginStatus.color">{{ loginStatus.msg }}</a-typography-text>
          <br />
          <div style="margin-top: 10px">
            <a-button type="primary" html-type="submit" @click="onLogin">登录</a-button>
            <a-button style="margin-left: 10px" @click="onReset">重置</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script setup>
import { reactive } from "vue"
import { UserService } from '@/services/userService'
import { useRouter } from "vue-router"
import { RoutePaths } from "@/utils/pathConstants"
import { useSessionStore } from "@/stores/session"

const sessionStore = useSessionStore()
const router = useRouter()

const userInfo = reactive({
  username: "",
  password: "",
})

const loginStatus = reactive({ msg: "", color: "secondary" })

const onLogin = function () {
  loginStatus.msg = "正在登录..."
  loginStatus.color = "secondary"
  UserService.login(userInfo).then((data) => {
    if (data.code == 0) {
      loginStatus.msg = "登录成功"
      loginStatus.color = "success"
      sessionStore.setUser(data.data)
      router.push(RoutePaths.mkIndex)
    } else {
      loginStatus.msg = data.message
      loginStatus.color = "danger"
    }
  })
}

const onReset = function () {
  userInfo.username = ""
  userInfo.password = ""
  loginStatus.msg = ""
}

</script>