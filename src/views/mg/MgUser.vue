<template>
  <a-layout>
    <rgw-breadcrumb title="用户" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="用户">
          <template #extra>
            <a-button type="primary" @click="addUserClicked">新增用户</a-button>
          </template>
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-table :dataSource="userList" :columns="userFields" rowKey="id" :pagination="paginationConf" size="small"
          @change="tableChanged">
        </a-table>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-modal width="50%" v-model:open="modalVisible" title="新增用户">
          <a-form ref="createUserFormRef" :model="userDto" :rules="userDtoRules" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 24 }">
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="userDto.username" placeholder="请输入用户名" />
            </a-form-item>

            <a-form-item label="昵称" name="nickname">
              <a-input v-model:value="userDto.nickname" placeholder="请输入用户昵称" />
            </a-form-item>

            <a-form-item label="角色" name="role">
              <a-select v-model:value="userDto.role" style="width: 400px" :show-arrow="true"
                :default-active-first-option="true" :options="RoleSelectOptions">
              </a-select>
            </a-form-item>

            <a-form-item label="组织" name="organizationId">
              <a-select v-model:value="userDto.organizationId" style="width: 400px" :default-active-first-option="false"
                :show-arrow="true" :filter-option="true" :not-found-content="null" :options="organizationChoices">
              </a-select>
            </a-form-item>

            <a-form-item has-feedback label="密码" name="password">
              <a-input v-model:value="userDto.password" type="password" autocomplete="new-password" placeholder="请输入密码" />
            </a-form-item>

            <a-form-item has-feedback label="密码确认" name="passpassComfirm">
              <a-input v-model:value="userDto.passpassComfirm" type="password" autocomplete="new-password"
                placeholder="请再次输入密码" />
            </a-form-item>

          </a-form>

          <template #footer>
            <a-button key="submit" type="primary" @click="confirmAdd">确认</a-button>
          </template>
        </a-modal>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import { reactive, ref } from 'vue'
import { OrganizationService } from "@/services/organizationService"
import { UserService } from "@/services/userService"
import { RoleSelectOptions } from "@/utils/bizConstants"
import { notification } from "ant-design-vue"
import { PATTERN_NORMAL_NAME, PATTERN_NORMAL_NAME_ZH } from "@/utils/patternConstants"
import { DefaultPaginationConf } from "@/utils/bizConstants"

const modalVisible = ref(false)
const paginationConf = reactive({ ...DefaultPaginationConf })
const createUserFormRef = ref()
const userDto = reactive({
  username: "",
  nickname: "",
  role: "NORMAL_USER",
  organizationId: "",
  password: "",
  passpassComfirm: "",
})

const clearUserDto = () => {
  userDto.username = ""
  userDto.nickname = ""
  userDto.role = "NORMAL_USER"
  userDto.organizationId = ""
  userDto.password = ""
  userDto.passpassComfirm = ""
}

const userList = ref([])

const userFields = [
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
  },
  {
    title: "角色",
    dataIndex: "roleDisplay",
  }
]

const validatePasswordComfirm = async (_, value) => {
  if (value === '') {
    return Promise.reject('请输入确认密码')
  } else if (value !== userDto.password) {
    return Promise.reject("确认密码输入不一致!")
  } else {
    return Promise.resolve()
  }
}

const userDtoRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, message: "用户名至少需要包含3个字符", trigger: "blur" },
    { max: 32, message: "用户名长度不能超过32个字符", trigger: "blur" },
    {
      pattern: PATTERN_NORMAL_NAME,
      message: "用户名只能包含字母,数字,下划线",
      trigger: "blur",
    },
  ],
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, message: "昵称至少需要包含2个字符", trigger: "blur" },
    { max: 32, message: "昵称长度不能超过32个字符", trigger: "blur" },
    {
      pattern: PATTERN_NORMAL_NAME_ZH,
      message: "昵称只能包含字母,数字,下划线,以及中文字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, message: "密码至少需要包含8个字符", trigger: "blur" },
    { max: 32, message: "密码长度不能超过32个字符", trigger: "blur" },
  ],
  passpassComfirm: [
    { validator: validatePasswordComfirm, trigger: 'change' }
  ],
  organizationId: [
    { required: true, message: "请选择用户所属组织", trigger: "blur" },
  ],
  role: [
    { required: true, message: "请选择用户角色", trigger: "blur" },
  ]
}

const organizationChoices = ref([])

const confirmAdd = () => {
  createUserFormRef.value.validate().then(() => {
    let finalUserDto = {
      username: userDto.username,
      nickname: userDto.nickname,
      role: userDto.role,
      organizationId: userDto.organizationId,
      password: userDto.password
    }
    UserService.createUser(finalUserDto).then(() => {
      notification.success({
        message: "新增用户成功",
        duration: 2,
      })
      modalVisible.value = false
      clearUserDto()
    })
  })
}

const fetchOrganizations = () => {
  OrganizationService.getOrganizations().then((data) => {
    let arr = []
    data.forEach(element => {
      arr.push({ label: element.name, value: element.id })
    })
    organizationChoices.value = arr
  })
}

const addUserClicked = () => {
  modalVisible.value = true
  if (organizationChoices.value.length == 0) {
    fetchOrganizations()
  }
}

const listUsers = (pageNum, pageSize) => {
  UserService.listUsers(pageNum, pageSize).then((data) => {
    userList.value = data.data
    paginationConf.total = data.total
    paginationConf.current = data.pageNum
    paginationConf.pageSize = data.pageSize
  })
}

const tableChanged = (changedPaginationConf) => {
  listUsers(changedPaginationConf.current, changedPaginationConf.pageSize)
}

listUsers(paginationConf.current, paginationConf.pageSize)
</script>