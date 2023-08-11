<template>
  <a-layout>
    <rgw-breadcrumb title="我的信息" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="我的信息">
          <template #extra>
            <a-button type="primary">更新信息</a-button>
            <a-button type="primary" @click="openChangePasswordDialog()">修改密码</a-button>
          </template>
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-descriptions title="" :column="1" bordered :labelStyle="{ width: '200px', 'background-color': 'white' }"
          :contentStyle="{ 'background-color': 'white' }">
          <a-descriptions-item label="用户名">{{ userInfo.username }}</a-descriptions-item>
          <a-descriptions-item label="昵称">{{ userInfo.nickname }}</a-descriptions-item>
          <a-descriptions-item label="角色">{{ userInfo.roleDisplay }}</a-descriptions-item>
          <a-descriptions-item label="所属组织">{{ userInfo.organizationName }}</a-descriptions-item>
          <a-descriptions-item label="电话">{{ userInfo.phone }}</a-descriptions-item>
          <a-descriptions-item label="邮件">{{ userInfo.email }}</a-descriptions-item>
          <a-descriptions-item label="地址">{{ userInfo.address }}</a-descriptions-item>
          <a-descriptions-item label="注册时间">{{ userInfo.createdDate }}</a-descriptions-item>
          <a-descriptions-item label="更新时间">{{ userInfo.lastModifiedDate }}</a-descriptions-item>
        </a-descriptions>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-modal width="50%" v-model:visible="changePasswordModalVisible" title="修改密码">
          <a-form ref="changePasswordFormRef" :model="changePasswordInfo" :rules="changePasswordRules"
            :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
            <a-form-item label="旧密码" name="oldPassword">
              <a-input type="password" autocomplete="off" v-model:value="changePasswordInfo.oldPassword" />
            </a-form-item>
            <a-form-item label="密码" name="password">
              <a-input type="password" autocomplete="off" v-model:value="changePasswordInfo.password"
                placeholder="请输入密码，至少需要8个字符" />
            </a-form-item>
            <a-form-item label="密码确认" name="passwordConfirm">
              <a-input type="password" autocomplete="off" v-model:value="changePasswordInfo.passwordConfirm"
                placeholder="请确认密码" />
            </a-form-item>
          </a-form>
          <template #footer>
            <a-button key="submit" type="primary" @click="confirmChangePassword">确认</a-button>
          </template>
        </a-modal>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { notification } from "ant-design-vue"

import { UserService } from "@/services/userService"

const userInfo = ref({})

const getSelfInfo = () => {
  UserService.getSelfDetailInfo().then((data) => {
    userInfo.value = data
  })
}

const changePasswordModalVisible = ref(false)
const changePasswordFormRef = ref()

const changePasswordInfo = reactive({
  oldPassword: '',
  password: '',
  passwordConfirm: ''
})

const validatePasswordConfirm = async (_, value) => {
  if (value === '') {
    return Promise.reject('请输入确认密码')
  } else if (value !== changePasswordInfo.password) {
    return Promise.reject("确认密码输入不一致!")
  } else if (value == changePasswordInfo.oldPassword) {
    return Promise.reject("新密码不能和旧密码相同!")
  }
  else {
    return Promise.resolve()
  }
}

const changePasswordRules = {
  oldPassword: [
    { required: true, message: "请输入旧密码", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, message: "密码至少需要包含8个字符", trigger: "blur" },
    { max: 32, message: "密码长度不能超过32个字符", trigger: "blur" },
  ],
  passwordConfirm: [
    { validator: validatePasswordConfirm, trigger: 'change' }
  ],
}

const openChangePasswordDialog = () => {
  changePasswordInfo.oldPassword = ''
  changePasswordInfo.password = ''
  changePasswordInfo.passwordConfirm = ''
  changePasswordModalVisible.value = true
}

const confirmChangePassword = () => {
  changePasswordFormRef.value.validate().then(() => {
    UserService.updatePassword(changePasswordInfo.oldPassword, changePasswordInfo.password).then(() => {
      notification.success({ message: "更新密码成功" })
      changePasswordModalVisible.value = false
    })
  })
}

getSelfInfo()
</script>