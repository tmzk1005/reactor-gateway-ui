<template>
  <a-layout>
    <rgw-breadcrumb title="用户" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="用户">
          <template #extra>
            <a-button type="primary" @click="addUserClicked" v-if="sessionStore.isSystemAdmin">新增用户</a-button>
          </template>
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-table :dataSource="userList" :columns="userFields" rowKey="id" :pagination="paginationConf" size="small"
          @change="tableChanged">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'enabled'">
              <span>
                <a-tag :color="record.enabled ? 'green' : 'red'">
                  {{ record.enabled ? "正常" : "禁用" }}
                </a-tag>
              </span>
            </template>

            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="link" style="padding: 0;"
                  :style="{ color: userIsSysAdmin(record) ? 'gray' : (record.enabled ? 'red' : 'green') }"
                  :disabled="userIsSysAdmin(record)" @click="switchUserEnableStatus(record)">
                  <template #icon>
                    <user-switch-outlined style="padding: 0; margin: 0;" />
                  </template>
                  {{ record.enabled ? "禁用" : "启用" }}
                </a-button>

                <a-popconfirm title="确认要删除用户吗?" ok-text="确认" cancel-text="取消" :disabled="userIsSysAdmin(record)"
                  @confirm="() => deleteUser(record)" v-if="sessionStore.isSystemAdmin">
                  <a-button type="link" style="padding: 0; color: red;" :disabled="userIsSysAdmin(record)"
                    :style="{ color: userIsSysAdmin(record) ? 'gray' : 'red' }">
                    <template #icon>
                      <delete-outlined style="padding: 0; margin: 0;" />
                    </template>
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
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

            <a-form-item label="电话" name="phone">
              <a-input v-model:value="userDto.phone" placeholder="请输入用户电话" />
            </a-form-item>

            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="userDto.email" placeholder="请输入用户邮箱" />
            </a-form-item>

            <a-form-item label="地址" name="address">
              <a-input v-model:value="userDto.address" placeholder="请输入用户地址" />
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
import { DeleteOutlined, UserSwitchOutlined } from '@ant-design/icons-vue'
import { reactive, ref } from 'vue'
import { OrganizationService } from "@/services/organizationService"
import { UserService } from "@/services/userService"
import { RoleSelectOptions, Role } from "@/utils/bizConstants"
import { notification } from "ant-design-vue"
import { PATTERN_NORMAL_NAME, PATTERN_NORMAL_NAME_ZH, PATTERN_PHONE } from "@/utils/patternConstants"
import { DefaultPaginationConf } from "@/utils/bizConstants"
import { useSessionStore } from "@/stores/session"

const sessionStore = useSessionStore()
const modalVisible = ref(false)
const paginationConf = reactive({ ...DefaultPaginationConf })
const createUserFormRef = ref()
const userDto = reactive({
  username: "",
  nickname: "",
  role: Role.normalUser,
  organizationId: "",
  password: "",
  passpassComfirm: "",
  phone: "",
  email: "",
  address: ""
})

const clearUserDto = () => {
  userDto.username = ""
  userDto.nickname = ""
  userDto.role = Role.normalUser
  userDto.organizationId = ""
  userDto.password = ""
  userDto.passpassComfirm = ""
  userDto.phone = ""
  userDto.email = ""
  userDto.address = ""
}

const userList = ref([])

const userFields = [
  {
    title: "用户名",
    dataIndex: "username",
    width: '150px',
    ellipsis: true,
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    width: '150px',
    ellipsis: true,
  },
  {
    title: "角色",
    dataIndex: "roleDisplay",
    width: '150px',
    ellipsis: true,
  },
  {
    title: "所属组织",
    dataIndex: "organizationName",
    width: '180px',
    ellipsis: true,
  },
  {
    title: "电话",
    dataIndex: "phone",
    width: '120px',
    ellipsis: true,
  },
  {
    title: "邮件",
    dataIndex: "email",
    width: '150px',
    ellipsis: true,
  },
  {
    title: "地址",
    dataIndex: "address",
    width: '220px',
    ellipsis: true,
  },
  {
    title: "启用状态",
    dataIndex: "enabled",
    width: '120px',
    ellipsis: true,
  },
  {
    title: "操作",
    key: "action",
  },
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
  ],
  phone: [
    { required: false, message: "请输入电话", trigger: "blur" },
    { min: 7, message: "电话号码长度不能低于7个字符", trigger: "blur" },
    { max: 32, message: "电话号码长度不能超过24个字符", trigger: "blur" },
    {
      pattern: PATTERN_PHONE,
      message: "电话号码只能包含数字和短横线",
      trigger: "blur",
    },
  ],
  email: [
    { required: false, message: "请输入邮箱", trigger: "blur" },
    { max: 32, message: "邮箱长度不能超过56个字符", trigger: "blur" }
  ],
  address: [
    { required: false, message: "请输入地址", trigger: "blur" },
    { max: 256, message: "地址长度不能超过256个字符", trigger: "blur" }
  ],
}

const userIsSysAdmin = (user) => user.role == Role.systemAdmin && user.username == "admin"

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

const switchUserEnableStatus = (user) => {
  if (user.enabled) {
    UserService.disableUser(user.id).then(() => user.enabled = false)
  } else {
    UserService.enableUser(user.id).then(() => user.enabled = true)
  }
}

const deleteUser = (user) => {
  UserService.deleteUser(user.id).then(() => {
    listUsers(paginationConf.current, paginationConf.pageSize)
  })
}

listUsers(paginationConf.current, paginationConf.pageSize)
</script>