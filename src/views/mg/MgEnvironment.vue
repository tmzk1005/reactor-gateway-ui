<template>
  <a-layout>
    <rgw-breadcrumb title="环境" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="环境">
          <template #extra>
            <a-button type="primary" @click="() => modalVisible = true" v-if="sessionStore.isSystemAdmin" >新建环境</a-button>
          </template>
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-table :dataSource="environmentList" :columns="environmentFields" rowKey="id" size="small" :pagination="false">
        </a-table>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-modal width="50%" v-model:open="modalVisible" title="新建环境">
          <a-form ref="newEnvironmentFormRef" :model="newEnvironment" :rules="newEnvironmentRules" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 24 }">
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

  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import { reactive, ref } from "vue"
import { notification } from "ant-design-vue"
import { EnvironmentService } from "@/services/environmentService"
import { PATTERN_NORMAL_NAME_ZH } from "@/utils/patternConstants"
import { useSessionStore } from "@/stores/session"

const sessionStore = useSessionStore()
const modalVisible = ref(false)
const environmentList = ref([])
const newEnvironmentFormRef = ref()

const environmentFields = [
  { title: "环境ID", dataIndex: "id", width: '120px', minWidth: '120px' },
  { title: "环境名称", dataIndex: "name" },
  { title: "创建时间", dataIndex: "createdDate" }
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

getEnvironments()
</script>