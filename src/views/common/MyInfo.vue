<template>
  <a-layout>
    <rgw-breadcrumb title="我的信息" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="我的信息">
          <template #extra>
            <a-button type="primary">更新信息</a-button>
            <a-button type="primary">修改密码</a-button>
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

  </a-layout>
</template>

<script setup>
import { ref } from 'vue'

import { UserService } from "@/services/userService"

const userInfo = ref({})

const getSelfInfo = () => {
  UserService.getSelfDetailInfo().then((data) => {
    userInfo.value = data
  })
}

getSelfInfo()
</script>