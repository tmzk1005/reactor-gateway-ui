<template>
  <a-row style="padding: 60px 0 50px 0; margin: 0">
    <a-col :offset="3" :span="18" class="search-container">
      <a-input-search v-model:value="searchText" placeholder="搜索API" size="large" :loading="isSearching" enter-button
        @search="doSearch">
        <template #addonBefore>
          <a-select v-model:value="contextEnvId" style="min-width: 120px; text-align: left;" @select="doSearch">
            <a-select-option v-for="env in environmentList" :key="env.id" :value="env.id">
              {{ env.name }}
            </a-select-option>
          </a-select>
        </template>
      </a-input-search>
    </a-col>
  </a-row>

  <a-row :gutter="[16, 16]" :wrap="true" style="padding: 0 40px 0 40px; margin: 0">
    <a-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" :xxl="6" v-for="releasedApi in releasedApiList"
      :key="releasedApi.id">
      <a-card type="inner" class="api-card">
        <template #title>
          <a-typography-title class="api-title" :level="4">{{ releasedApi.name }}</a-typography-title>
        </template>
        <template #actions>
          <span v-show="releasedApi.appAuthEnabled">
            <a-button type="link" @click="applyApi(releasedApi)">
              <template #icon>
                <EyeOutlined />
              </template>
              申请访问
            </a-button>
          </span>
          <a-button type="link" @click="showApiDetails(releasedApi)">
            <template #icon>
              <MoreOutlined />
            </template>
            详情
          </a-button>
        </template>
        <div class="api-container">
          <div v-if="releasedApi.tags.length > 0">
            <span>
              <a-tag v-for="tag in releasedApi.tags" v-bind:key="tag" :color="'green'">
                {{ tag }}
              </a-tag>
            </span>
            <a-divider />
          </div>
          <pre class="api-desc">{{ releasedApi.description }}</pre>
        </div>
      </a-card>
    </a-col>
  </a-row>

  <a-row :gutter="[16, 16]" style="padding: 30px 40px 0 40px; margin: 0" justify="end">
    <a-col>
      <a-pagination :showQuickJumper="paginationConf.showQuickJumper" :showSizeChanger="paginationConf.showSizeChanger"
        :total="paginationConf.total" :current="paginationConf.current" :pageSize="paginationConf.pageSize"
        :pageSizeOptions="paginationConf.pageSizeOptions" :showTotal="paginationConf.showTotal" @change="pageChanged" />
    </a-col>
  </a-row>

  <a-row>
    <a-col :span="24">
      <a-modal width="80%" v-model:open="detailDialogVisible" :footer="null">

        <a-page-header title="基本信息">
          <a-descriptions :bordered="true" size="small" :column="2" :labelStyle="{ width: '180px' }">
            <a-descriptions-item label="ID">{{ apiDetail.id }}</a-descriptions-item>
            <a-descriptions-item label="发布时间">{{ apiDetail.releaseTime }}</a-descriptions-item>

            <a-descriptions-item label="名称" :span="2">{{ apiDetail.name }}</a-descriptions-item>

            <a-descriptions-item label="标签" :span="2">
              <a-tag v-for="tag in apiDetail.tags" v-bind:key="tag" :color="'green'">{{ tag }}</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="描述" :span="2">
              <pre>{{ apiDetail.description }}</pre>
            </a-descriptions-item>
          </a-descriptions>
        </a-page-header>

        <a-page-header title="请求信息">
          <a-descriptions :bordered="true" size="small" :column="3" :labelStyle="{ width: '180px' }">
            <a-descriptions-item label="请求方法">
              <a-tag v-for="method in apiDetail.methods" v-bind:key="method">{{ method }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="请求路径">{{ apiDetail.path }}</a-descriptions-item>
          </a-descriptions>
        </a-page-header>

        <a-page-header title="文档">
          TODO
        </a-page-header>

      </a-modal>
    </a-col>
  </a-row>

  <a-row>
    <a-col :span="24">
      <a-modal width="50%" v-model:open="applyDialogVisible" title="申请访问API">

        <a-descriptions :bordered="true" :column="1" :labelStyle="{ width: '180px' }">
          <a-descriptions-item label="API名称">{{ applyApiName }}</a-descriptions-item>
          <a-descriptions-item label="应用">
            <a-select v-model:value="choosedApp.id" :show-arrow="true" :allowClear="true" :options="appSelectOptions"
              placeholder="选择申请访问API的应用" style="width: 100%;">
            </a-select>
          </a-descriptions-item>
        </a-descriptions>

        <template #footer>
          <a-button key="submit" type="primary" @click="confirmApplyApi()">确认</a-button>
        </template>
      </a-modal>
    </a-col>
  </a-row>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { EnvironmentService } from "@/services/environmentService"
import { ApiService } from "@/services/apiService"
import { AppService } from "@/services/appService"
import { EyeOutlined, MoreOutlined } from '@ant-design/icons-vue'
import { DefaultPaginationConf } from "@/utils/bizConstants"
import { SubscriptionService } from "@/services/subscriptionService"
import { notification } from "ant-design-vue"

// -------------------- API搜索逻辑 --------------------

const searchText = ref('')
const isSearching = ref(false)
const environmentList = ref([])
const contextEnvId = ref('')
const releasedApiList = ref([])

const customPaginationConf = { ...DefaultPaginationConf }
customPaginationConf.pageSizeOptions = ["4", "8", "12", "16", "24", "48"]
customPaginationConf.pageSize = 12
const paginationConf = reactive(customPaginationConf)

const getEnvironments = () => {
  EnvironmentService.getEnvironments().then((data) => {
    environmentList.value = data
    contextEnvId.value = environmentList.value[0].id
    doSearch()
  })
}

getEnvironments()

const doSearch = () => {
  ApiService.searchReleasedApi(contextEnvId.value, searchText.value, paginationConf.current, paginationConf.pageSize).then((pageData) => {
    // console.log(pageData)
    releasedApiList.value = pageData.data
    paginationConf.total = pageData.total
    paginationConf.current = pageData.pageNum
    paginationConf.pageSize = pageData.pageSize
  })
}
const pageChanged = (pageNum, pageSize) => {
  paginationConf.current = pageNum
  paginationConf.pageSize = pageSize
  doSearch()
}

// -------------------- API详情展示逻辑 --------------------

const detailDialogVisible = ref(false)
const apiDetail = ref({})

const showApiDetails = (releasedApi) => {
  apiDetail.value = releasedApi
  detailDialogVisible.value = true
}

// -------------------- API订阅申请逻辑 --------------------

const applyDialogVisible = ref(false)
const appSelectOptions = ref([])
const choosedApp = reactive({
  "id": null
})
let applyApiId = null
let applyApiName = ref("")

const fetchApps = (pageNum, pageSize) => {
  AppService.listApps(pageNum, pageSize).then((pageData) => {
    appSelectOptions.value = pageData.data.map((item) => ({ label: item.name, value: item.id }))
    if (appSelectOptions.value.length > 0 && choosedApp.id == null) {
      choosedApp.id = appSelectOptions.value[0].value
    }
  })
}

const applyApi = (releasedApi) => {
  applyApiId = releasedApi.id
  applyApiName.value = releasedApi.name

  if (appSelectOptions.value.length == 0) {
    fetchApps(1, 200)
  }
  applyDialogVisible.value = true
}

const confirmApplyApi = () => {
  SubscriptionService.subscribe(choosedApp.id, applyApiId).then(() => {
    notification.success({ "message": "提交API访问申请成功，请等待API所有者审核!" })
    applyDialogVisible.value = false
    applyApiId = null
    applyApiName.value = ""
  })
}
</script>

<style scoped>
:deep(.search-container .ant-input) {
  font-family: monospace;
}

:deep(.api-card .api-title) {
  margin-top: 12px;
}

.api-container {
  height: 150px;
  max-height: 150px;
  overflow: hidden
}

.api-desc {
  margin-top: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-overflow: ellipsis;
}
</style>