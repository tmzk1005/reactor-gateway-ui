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
          </template>
        </a-table>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import { reactive, ref } from "vue"
import { ApiService } from "@/services/apiService"
import { DefaultPaginationConf } from "@/utils/bizConstants"
import { colorForHttpMethod } from "@/utils/bizConstants"
import { useSessionStore } from "@/stores/session"
import { useRouter } from "vue-router"
import { RouteNames, RoutePaths } from '@/utils/pathConstants'

const sessionStore = useSessionStore()
const router = useRouter()

const paginationConf = reactive({ ...DefaultPaginationConf })
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

const listApis = (pageNum, pageSize) => {
  ApiService.listApis(pageNum, pageSize).then((pageData) => {
    apiList.value = pageData.data
    paginationConf.total = pageData.total
    paginationConf.current = pageData.pageNum
    paginationConf.pageSize = pageData.pageSize
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