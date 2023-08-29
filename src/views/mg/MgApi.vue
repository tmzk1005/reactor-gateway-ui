<template>
  <a-layout>
    <rgw-breadcrumb title="API" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="API" style="font-family: monospace;">
          <template #extra>
            <a-button type="primary" @click="router.push(RoutePaths.mgApiCreate)" style="font-family: monospace;"
              v-if="sessionStore.isNormalUser">新建API</a-button>
          </template>
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" class="api-search-form">
      <a-col :span="24">
        <a-form ref="apiSearchConditionsFrom" name="apiSearch" :model="apiSearchConditions" :labelCol="{ span: 4 }"
          @finish="listApis(1, paginationConf.pageSize)">
          <a-row>
            <a-col :span="9">
              <a-form-item label="API名称" name="name">
                <a-input v-model:value="apiSearchConditions.name" placeholder="按输入的API名称模糊匹配" />
              </a-form-item>
            </a-col>

            <a-col :span="9">
              <a-form-item label="ID" name="id">
                <a-input v-model:value="apiSearchConditions.id" placeholder="输入ID精确查找指定的API" />
              </a-form-item>
            </a-col>

            <a-col :span="6" style="text-align: right">
              <a @click="apiSearchConditionsFromExpand = !apiSearchConditionsFromExpand" style="margin-right: 10px;">
                <template v-if="apiSearchConditionsFromExpand">
                  <up-outlined />
                </template>
                <template v-else>
                  <down-outlined />
                </template>
                更多条件
              </a>
              <a-button size="small" type="primary" html-type="submit">查询</a-button>
              <a-button size="small" style="margin: 0 8px" @click="apiSearchConditionsFromReset">重置
              </a-button>
            </a-col>
          </a-row>

          <a-row v-if="apiSearchConditionsFromExpand">
            <a-col :span="9">
              <a-form-item label="方法" name="method">
                <a-select :show-arrow="true" :allow-clear="true" v-model:value="apiSearchConditions.method"
                  placeholder="请选择HTTP请求方法">
                  <a-select-option value="GET">GET</a-select-option>
                  <a-select-option value="POST">POST</a-select-option>
                  <a-select-option value="PUT">PUT</a-select-option>
                  <a-select-option value="DELETE">DELETE</a-select-option>
                  <a-select-option value="HEAD">HEAD</a-select-option>
                  <a-select-option value="PATCH">PATCH</a-select-option>
                  <a-select-option value="OPTIONS">OPTIONS</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="9">
              <a-form-item label="路径" name="path">
                <a-input v-model:value="apiSearchConditions.path" placeholder="API请求路径" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row v-if="apiSearchConditionsFromExpand">
            <a-col :span="18">
              <a-form-item label="标签" name="tag" :labelCol="{ span: 2 }">
                <div style="display: flex;">
                  <a-select v-model:value="apiSearchConditions.tags" mode="tags" :allow-clear="true"
                    placeholder="按标签查找和过滤API,支持AND和OR两种模式" :options="[]">
                  </a-select>
                  <a-form-item-rest>
                    <a-tooltip placement="topLeft" arrow-point-at-center title="标签过滤模式">
                      <a-select v-model:value="tagModeIsAnd" style="width: 80px;">
                        <a-select-option value="true">AND</a-select-option>
                        <a-select-option value="false">OR</a-select-option>
                      </a-select>
                    </a-tooltip>
                  </a-form-item-rest>
                </div>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row v-if="apiSearchConditionsFromExpand">
            <a-col :span="18">
              <a-form-item label="描述" name="description" :labelCol="{ span: 2 }">
                <a-input v-model:value="apiSearchConditions.description" placeholder="输入API的描述信息进行模糊查询" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-table :dataSource="apiList" :columns="apiFields" rowKey="id" :pagination="paginationConf" size="small"
          @change="tableChanged" style="font-family: monospace;">
          <template v-slot:bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <span>
                <a-button style="padding-left: 0;" type="link" @click="goToApiDetailPage(record.id)">
                  {{ record.name }}
                </a-button>
              </span>
            </template>
            <template v-else-if="column.key === 'methods'">
              <span>
                <a-tag v-for="method in record.routeDefinition.methods" v-bind:key="method"
                  :color="colorForHttpMethod(method)">
                  {{ method }}
                </a-tag>
              </span>
            </template>
            <template v-else-if="column.key === 'path'">
              <span style="font-family: monospace;">
                {{ record.routeDefinition.path }}
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'tags'">
              <span>
                <a-tag v-for="tag in record.tags" v-bind:key="tag" :color="'green'">
                  {{ tag }}
                </a-tag>
              </span>
            </template>

            <template v-else-if="sessionStore.isNormalUser && column.key === 'action'">
              <a-space>
                <a-button type="link" style="padding: 0;" @click="editApi(record.id)">
                  <template #icon>
                    <edit-outlined style="padding: 0; margin: 0;" />
                  </template>
                  编辑
                </a-button>
                <a-tooltip placement="topLeft" arrow-point-at-center title="删除功能暂未实现">
                  <a-button type="link" style="padding: 0; color: red;" :disabled="true">
                    <template #icon>
                      <delete-outlined style="padding: 0; margin: 0;" />
                    </template>
                    删除
                  </a-button>
                </a-tooltip>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import { reactive, ref } from "vue"
import { DeleteOutlined, EditOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { ApiService } from "@/services/apiService"
import { DefaultPaginationConf } from "@/utils/bizConstants"
import { colorForHttpMethod } from "@/utils/bizConstants"
import { useSessionStore } from "@/stores/session"
import { useRouter } from "vue-router"
import { RouteNames, RoutePaths } from '@/utils/pathConstants'

const sessionStore = useSessionStore()
const router = useRouter()

const paginationConf = reactive({ ...DefaultPaginationConf })

// ------------------------- 过滤条件 -------------------------

const apiSearchConditionsFrom = ref()
const apiSearchConditionsFromExpand = ref(false)

const tagModeIsAnd = ref('true')

const apiSearchConditions = reactive({
  id: null,
  name: null,
  method: null,
  path: null,
  tags: [],
  description: null,
})

const apiSearchConditionsFromReset = () => {
  apiSearchConditions.id = null
  apiSearchConditions.name = null
  apiSearchConditions.method = null
  apiSearchConditions.path = null
  apiSearchConditions.tags = []
  apiSearchConditions.tagModeIsAnd = 'true'
  apiSearchConditions.description = null
}

// ------------------------- API列表

const apiList = ref([])

const apiFields = [
  {
    title: "API-ID",
    dataIndex: "id",
    width: '120px',
    minWidth: '120px'
  },
  {
    title: "API名称",
    dataIndex: "name",
  },
  {
    title: "HTTP请求方法",
    key: "methods",
    dataIndex: ["routeDefinition", "methods"],
  },
  {
    title: "HTTP请求路径",
    key: "path",
    dataIndex: ["routeDefinition", "path"],
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
]

if (sessionStore.isNormalUser) {
  apiFields.push({
    title: "操作",
    key: "action",
    width: '200px',
    fixed: 'right',
  })
}

const listApis = (pageNum, pageSize) => {
  let params = {}
  for (let pName in apiSearchConditions) {
    if (apiSearchConditions[pName]) {
      params[pName] = apiSearchConditions[pName]
    }
  }

  if (params['tags'] && tagModeIsAnd.value == 'false') {
    params['tagModeIsAnd'] = 'false'
  }

  ApiService.listApis(pageNum, pageSize, params).then((pageData) => {
    apiList.value = pageData.data
    paginationConf.total = pageData.total
    paginationConf.current = pageData.pageNum
    paginationConf.pageSize = pageData.pageSize
  })
}

const editApi = (apiId) => {
  router.push({
    name: RouteNames.mgApiUpdate,
    params: { apiId: apiId }
  })
}

const tableChanged = (changedPaginationConf) => {
  listApis(changedPaginationConf.current, changedPaginationConf.pageSize)
}

const goToApiDetailPage = (apiId) => {
  router.push({
    name: RouteNames.mgApiDetail,
    params: { apiId: apiId }
  })
}

listApis(paginationConf.current, paginationConf.pageSize)

</script>

<style scoped>
.api-search-form {
  background-color: floralwhite;
  padding: 10px 10px;
  margin: 10px 0;
}

:deep(.ant-form-item-label) {
  font-family: monospace;
}

:deep(.ant-input) {
  font-family: monospace;
}
</style>