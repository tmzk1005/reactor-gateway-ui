<template>
  <a-layout>
    <rgw-breadcrumb title="环境" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="环境">
          <template #extra>
            <a-button type="primary" @click="() => modalVisible = true" v-if="sessionStore.isSystemAdmin">新建环境</a-button>
          </template>
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-table :dataSource="environmentList" :columns="environmentFields" rowKey="id" size="small" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <a-button type="link" style="padding: 0;" @click="showEnvVars(record.id, record.name, null)">{{ record.name }}</a-button>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-modal width="50%" v-model:open="modalVisible" title="新建环境">
          <a-form ref="newEnvironmentFormRef" :model="newEnvironment" :rules="newEnvironmentRules"
            :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
            <a-form-item label="环境名称" name="name">
              <a-input v-model:value="newEnvironment.name" placeholder="请输入环境名称" />
            </a-form-item>
          </a-form>
          <template #footer>
            <a-button key="submit" type="primary" @click="confirmAdd">确认</a-button>
          </template>
        </a-modal>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-modal width="60%" v-model:open="showEnvVarsModalVisible" :title="modalTitle" :maskClosable="false">
          <a-table v-if="showEnvVarsModalVisible" id="envVarsTable" :dataSource="oneOrgEnvVars" :columns="envVarFileds"
            rowKey="varName" :pagination="false" :scroll="tableScrollConf">
            <template #bodyCell="{ index, column, record }">

              <template v-if="column.dataIndex == 'varValue'">
                <span v-if="record.editing == record.varName">
                  <a-input v-model:value="record.varValue" @pressEnter="saveEditedVar"></a-input>
                </span>
                <span v-else-if="!record.deleted">
                  <span :style="{ color: record.changed() ? 'green' : '' }">{{ record.varValue }}</span>
                  <a-button class="env-var-edit-btn" type="link" @click="startEdit(record)">
                    <span><edit-outlined /></span>
                  </a-button>
                </span>
              </template>

              <template v-else-if="column.dataIndex == 'varName'">
                <span :style="{ color: record.changed() ? 'green' : '' }">{{ record.varName }}</span>
              </template>

              <template v-else-if="column.key == 'status'">
                <a-tag v-if="record.deleted" style="color:red;">已删除</a-tag>
                <a-tag v-else-if="record.changed()" style="color:green;">已更新</a-tag>
                <a-tag v-else-if="record.isNew" style="color:blue;">新增</a-tag>
              </template>

              <template v-else-if="column.key == 'action'">
                <a-button v-if="record.deleted" type="link" style="padding: 0; color: green;"
                  @click="cancleDeleteVar(record)">
                  <template #icon>
                    <close-circle-outlined style="padding: 0; margin: 0;" />
                  </template>
                  恢复
                </a-button>
                <a-button v-else type="link" style="padding: 0; color: red;" @click="deleteVar(record, index)">
                  <template #icon>
                    <close-circle-outlined style="padding: 0; margin: 0;" />
                  </template>
                  删除
                </a-button>
              </template>
            </template>
          </a-table>
          <template #footer>
            <a-space style="float: left;">
              <a-input style="width: 250px;" placeholder="请输入新环境变量名" v-model:value="newEnvVar.varName"></a-input>
              <a-input style="width: 400px;" placeholder="请输入新环境变量值" v-model:value="newEnvVar.varValue"></a-input>
              <a-button type="primary" key="cancleEditEnvs" @click="addNewEnvVar">添加环境变量</a-button>
            </a-space>
            <a-button key="cancleEditEnvs" @click="canelEditVars">重置</a-button>
            <a-button key="saveEnvs" type="primary" @click="saveEditVars">保存编辑</a-button>
          </template>
        </a-modal>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24">
        <a-modal width="60%" v-model:open="showEnvVarsModalForSystemAdminVisible" :title="modalTitle" :footer="null">
          <a-select v-model:value="organization.id" style="width: 400px; padding: 15px 0;" :default-active-first-option="false"
            :show-arrow="true" :filter-option="true" :not-found-content="null" :options="organizationChoices" @select="selectOrg">
          </a-select>
          <a-table v-if="showEnvVarsModalForSystemAdminVisible" :dataSource="oneOrgEnvVars"
            :columns="readonlyEnvVarFileds" rowKey="varName" :pagination="false" :scroll="tableScrollConf">
          </a-table>
        </a-modal>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import { EditOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { onMounted, onUnmounted, reactive, ref } from "vue"
import { notification } from "ant-design-vue"
import { EnvironmentService } from "@/services/environmentService"
import { OrganizationService } from "@/services/organizationService"
import { PATTERN_NORMAL_NAME_ZH } from "@/utils/patternConstants"
import { useSessionStore } from "@/stores/session"

const sessionStore = useSessionStore()
const modalVisible = ref(false)
const showEnvVarsModalVisible = ref(false)
const showEnvVarsModalForSystemAdminVisible = ref(false)
const environmentList = ref([])
const newEnvironmentFormRef = ref()

let rawOneOrgEnvVars = []
const oneOrgEnvVars = ref([])

const modalTitle = ref("")

const environmentFields = [
  { title: "环境名称", dataIndex: "name", width: '200px', minWidth: '200px' },
  { title: "环境ID", dataIndex: "id", width: '240px', minWidth: '240px' },
  { title: "创建时间", dataIndex: "createdDate" }
]

const tableScrollConf = reactive({
  y: window.innerHeight - 300
})

const windowResizeListener = () => {
  tableScrollConf.y = window.innerHeight - 300
}

onMounted(() => {
  window.addEventListener('resize', windowResizeListener)
})

onUnmounted(() => {
  window.removeEventListener('resize', windowResizeListener)
})

const readonlyEnvVarFileds = [
  {
    title: "变量名",
    dataIndex: "varName",
    width: '200px',
    minWidth: '200px'
  },
  {
    title: "变量值",
    dataIndex: "varValue",
  },
]

const envVarFileds = [
  {
    title: "变量名",
    dataIndex: "varName",
    width: '200px',
    minWidth: '200px'
  },
  {
    title: "变量值",
    dataIndex: "varValue",
  },
  {
    title: "状态",
    key: "status",
    width: '200px',
    minWidth: '200px'
  },
  {
    title: "操作",
    key: "action",
    width: '200px',
    minWidth: '200px'
  },
]

const newEnvironmentRules = {
  name: [
    { required: true, message: "请输入环境名称", trigger: "blur" },
    { min: 3, message: "环境名称至少需要包含3个字符", trigger: "blur" },
    { max: 32, message: "环境名称长度不能超过32个字符", trigger: "blur" },
    {
      pattern: PATTERN_NORMAL_NAME_ZH,
      message: "环境名只能包含字母,数字,下划线,以及中文",
      trigger: "blur",
    },
  ]
}

const newEnvironment = reactive({
  name: null,
})

const getEnvironments = () => {
  EnvironmentService.getEnvironments().then((data) => {
    environmentList.value = data
  })
}

const confirmAdd = () => {
  newEnvironmentFormRef.value.validate().then(() => {
    let dto = { name: newEnvironment.name }
    EnvironmentService.createEnvironment(dto).then(() => {
      notification.success({ message: "新建环境成功" })
      modalVisible.value = false
      newEnvironment.name = null
      getEnvironments()
    })
  })
}

const startEdit = (record) => {
  for (var i = 0; i < oneOrgEnvVars.value.length; i++) {
    oneOrgEnvVars.value[i].editing = null
  }
  record.editing = record.varName
}

const saveEditedVar = () => {
  for (var i = 0; i < oneOrgEnvVars.value.length; i++) {
    oneOrgEnvVars.value[i].editing = null
    if (oneOrgEnvVars.value[i].changed() && !oneOrgEnvVars.value[i].deleted) {
      let ele = document.querySelector(`tbody.ant-table-tbody > tr[data-row-key=${oneOrgEnvVars.value[i].varName}]`)
      ele.style.backgroundColor = 'bisque'
    }
  }
}

const deleteVar = (record, index) => {
  if (record.isNew) {
    console.log('remove new')
    oneOrgEnvVars.value.splice(index, 1)
    return
  }

  record.deleted = true
  let ele = document.querySelector(`tbody.ant-table-tbody > tr[data-row-key=${record.varName}]`)
  ele.style.backgroundColor = '#999999'
  ele.style.opacity = 0.5
}

const cancleDeleteVar = (record) => {
  record.deleted = false
  let ele = document.querySelector(`tbody.ant-table-tbody > tr[data-row-key=${record.varName}]`)
  ele.style.backgroundColor = ''
  ele.style.opacity = 1
}

const canelEditVars = () => {
  let tmpArr = []
  for (var i = 0; i < rawOneOrgEnvVars.length; i++) {
    let item = { ...rawOneOrgEnvVars[i] }
    item.editing = null
    item.deleted = false
    item.rawVarValue = item.varValue
    item.changed = () => item.varValue != item.rawVarValue
    tmpArr.push(item)

    let ele = document.querySelector(`tbody.ant-table-tbody > tr[data-row-key=${item.varName}]`)

    if (ele) {
      ele.style.backgroundColor = null
      ele.style.opacity = 1
    }
  }
  oneOrgEnvVars.value = tmpArr
}

let currentEditEnv = null
let currentEditEnvName = null

const organizationChoices = ref([])

const fetchOrganizations = () => {
  OrganizationService.getOrganizations().then((data) => {
    let arr = []
    data.forEach(element => {
      arr.push({ label: element.name, value: element.id })
    })
    organizationChoices.value = arr
  })
}

const organization = reactive({
  id: "",
  name: "",
})

const showEnvVars = (envId, envName, org) => {
  currentEditEnv = envId
  currentEditEnvName = envName

  if (org == null) {
    organization.id = sessionStore.userInfo.organizationId
    organization.name = sessionStore.userInfo.organizationName
  } else {
    organization.id = org.id
    organization.name = org.name
  }

  if (sessionStore.isNormalUser) {
    showEnvVarsModalForSystemAdminVisible.value = false
    showEnvVarsModalVisible.value = true
  } else {
    showEnvVarsModalVisible.value = false
    showEnvVarsModalForSystemAdminVisible.value = true
    if (organizationChoices.value.length == 0) {
      fetchOrganizations()
    }
  }
  modalTitle.value = `${organization.name} ${currentEditEnvName}`
  EnvironmentService.getVarsInEnv(envId, organization.id).then((data) => {
    showVarsInModal(data)
    currentEditEnv = envId
    currentEditEnvName = envName
  })
}

const showVarsInModal = (data) => {
  rawOneOrgEnvVars = data.variableList
  if (rawOneOrgEnvVars.length == 0) {
    // for test
    for (var i = 0; i < 5; i++) {
      rawOneOrgEnvVars.push({
        varName: "name" + i,
        varValue: "value" + i
      })
    }
  }
  canelEditVars()
}


const saveEditVars = () => {
  EnvironmentService.setVarsInEnv(currentEditEnv, sessionStore.userInfo.organizationId, oneOrgEnvVars.value).then((data) => {
    notification.success({
      message: "保存环境变量成功",
      duration: 2,
    })
    showVarsInModal(data)
  })
}

const newEnvVar = reactive({
  varName: "",
  varValue: ""
})

const addNewEnvVar = () => {
  if (!newEnvVar.varName || newEnvVar.varName.trim() == '') {
    notification.error({ message: "新环境变量名称不能为空", duration: 3, })
    return
  }

  for (var i = 0; i < oneOrgEnvVars.value.length; i++) {
    if (newEnvVar.varName == oneOrgEnvVars.value[i].varName) {
      notification.error({ message: "新环境变量名称不能和已有的环境变量名重复", duration: 3, })
      return
    }
  }
  let rgx = /^\w{3,32}$/g
  if (!rgx.test(newEnvVar.varName)) {
    notification.error({ message: "新环境变量名称只能包含字母,数字以及下划线,且长度大于等于3,小于等于32", duration: 3, })
    return
  }

  if (!newEnvVar.varValue) {
    newEnvVar.varValue = ''
  }

  newEnvVar.varName = newEnvVar.varName.trim()

  oneOrgEnvVars.value.push({
    varName: newEnvVar.varName,
    varValue: newEnvVar.varValue,
    isNew: true,
    deleted: false,
    rawVarValue: null,
    changed: () => false
  })
  newEnvVar.varName = ""
  newEnvVar.varValue = ""
}

const selectOrg = (orgId) => {
  if (orgId == organization.id) {
    return
  }
  let org = {id: orgId, name: null}
  for (var i = 0; i < organizationChoices.value.length; i++) {
    if (orgId == organizationChoices.value[i].value) {
      org.name = organizationChoices.value[i].label
      break
    }
  }
  showEnvVars(currentEditEnv, currentEditEnvName, org)
}

getEnvironments()
</script>

<style scoped>
.ant-table-cell .env-var-edit-btn {
  visibility: hidden;
}

.ant-table-cell:hover .env-var-edit-btn {
  visibility: visible;
}
</style>
