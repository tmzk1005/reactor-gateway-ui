<template>
  <a-layout>
    <rgw-breadcrumb title="应用" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="应用">
          <template #extra>
            <a-button type="primary" v-if="sessionStore.isNormalUser" @click="() => dialogVisible = true">新建应用</a-button>
          </template>
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-table :dataSource="appList" :columns="appFields" rowKey="id" :pagination="paginationConf" size="small"
          @change="tableChanged">

          <template #bodyCell="{ column, record }">

            <template v-if="column.dataIndex === 'key'">
              <pre style="margin: 0"><code>{{ record.key }}</code></pre>
            </template>

            <template v-else-if="column.dataIndex === 'secret'">
              <pre style="margin: 0"><code>{{ record.secret }}</code></pre>
            </template>

            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="link" style="padding: 0;">
                  <template #icon>
                    <exclamation-circle-outlined style="padding: 0; margin: 0;" />
                  </template>
                  详情
                </a-button>
                <a-button v-if="sessionStore.isNormalUser" type="link" style="padding: 0;">
                  <template #icon>
                    <delete-outlined style="padding: 0; margin: 0;" />
                  </template>
                  删除
                </a-button>
              </a-space>
            </template>
          </template>

        </a-table>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-modal width="50%" v-model:open="dialogVisible" title="新建应用">
          <a-form ref="formRef" :model="appDto" :rules="appDtoRules" :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }">
            <a-form-item label="应用名称" name="name">
              <a-input v-model:value="appDto.name" />
            </a-form-item>
            <a-form-item label="描述" name="description">
              <a-input v-model:value="appDto.description" />
            </a-form-item>
          </a-form>
          <template #footer>
            <a-button key="submit" type="primary" @click="confirmAddApp">确认</a-button>
          </template>
        </a-modal>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script setup>
import { useSessionStore } from "@/stores/session"
import { PATTERN_NORMAL_NAME_ZH } from "@/utils/patternConstants"
import { reactive, ref } from "vue"
import { notification } from "ant-design-vue"
import { AppService } from "@/services/appService"
import { DefaultPaginationConf } from "@/utils/bizConstants"

const sessionStore = useSessionStore()

const appList = ref([])

const dialogVisible = ref(false)
const paginationConf = reactive({ ...DefaultPaginationConf })

const formRef = ref()

const appDtoRules = {
  name: [
    { required: true, message: "请输入应用名称", trigger: "blur" },
    { min: 3, message: "应用名称至少需要包含3个字符", trigger: "blur" },
    { max: 32, message: "应用名称长度不能超过32个字符", trigger: "blur" },
    {
      pattern: PATTERN_NORMAL_NAME_ZH,
      message: "应用名称只能包含字母,数字,下划线,以及中文字符",
      trigger: "blur",
    },
  ]
}

const appFields = [
  {
    title: "应用名称",
    dataIndex: "name",
  },
  {
    title: "应用Key",
    dataIndex: "key",
  },
  {
    title: "应用Secret",
    dataIndex: "secret",
  },
  {
    title: "操作",
    key: "action",
  },
]

const appDto = reactive({
  name: "",
  description: ""
})

const confirmAddApp = () => {
  appDto.name = appDto.name.trim()
  appDto.description = appDto.description.trim()

  formRef.value.validate().then(() => {
    AppService.createApp(appDto).then(() => {
      notification.success({ "message": "新建应用成功" })
      dialogVisible.value = false
      appDto.name = ""
      appDto.description = ""
      listApps(1, paginationConf.pageSize)
    })
  })
}

const listApps = (pageNum, pageSize) => {
  AppService.listApps(pageNum, pageSize).then((data) => {
    appList.value = data.data
    paginationConf.total = data.total
    paginationConf.current = data.pageNum
    paginationConf.pageSize = data.pageSize
  })
}

const tableChanged = (changedPaginationConf) => {
  listApps(changedPaginationConf.current, changedPaginationConf.pageSize)
}

listApps(paginationConf.current, paginationConf.pageSize)
</script>