<template>
  <a-layout>
    <rgw-breadcrumb title="访问日志" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="访问日志">
          <template #extra>
            <a-select v-model:value="contextEnvId" style="min-width: 120px; text-align: left;" @change="envChanged">
              <a-select-option v-for="env in environmentOptions" :key="env.id" :value="env.id">
                {{ env.name }}
              </a-select-option>
            </a-select>
          </template>
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" style="margin-top: 20px;">
      <a-col :span="24">
        <a-table :dataSource="accessLogs" :columns="accessLogFields" rowKey="id" :pagination="paginationConf" size="small"
          :bordered="true" @change="tableChanged">
          <template v-slot:bodyCell="{ column, record }">
            <template v-if="column.key === 'requestInfoMethod'">
              <span>
                <a-tag :color="colorForHttpMethod(record.requestInfo.method)">
                  {{ record.requestInfo.method }}
                </a-tag>
              </span>
            </template>

            <template v-else-if="column.dataIndex === 'millisCost'">
              <span>
                <a-tooltip placement="topLeft" :title="record.millisCost + ' 毫秒'">
                  <span :style="{ float: 'left', color: colorForRequestTimeMillisCost(record.millisCost) }">
                    {{ timeMillisDisplay(record.millisCost)[0] }}
                  </span>
                  <span style="float: right;">{{ timeMillisDisplay(record.millisCost)[1] }}</span>
                </a-tooltip>
              </span>
            </template>

            <template v-else-if="column.key === 'repsonseInfoCode'">
              <a-tag :color="colorForResponseStatus(record.responseInfo.code)">{{ record.responseInfo.code }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import { onMounted, reactive, ref } from 'vue'
import { DefaultPaginationConf } from "@/utils/bizConstants"
import { colorForRequestTimeMillisCost, timeMillisDisplay, colorForResponseStatus } from "@/utils/formatter"
import { AccessLogService } from "@/services/accessLogService"
import { EnvironmentService } from "@/services/environmentService"
import { colorForHttpMethod } from "@/utils/bizConstants"

const environmentOptions = ref([])
const contextEnvId = ref('')
const accessLogs = ref([])

const accessLogFields = [
  {
    title: "请求标识ID",
    dataIndex: "requestId",
    width: '110px',
    minWidth: '110px',
  },
  {
    title: "API名称",
    dataIndex: "apiName",
    width: '200px',
    ellipsis: true,
  },
  {
    title: "请求方法",
    key: "requestInfoMethod",
    dataIndex: ["requestInfo", "method"],
    width: '80px',
  },
  {
    title: "请求Uri",
    dataIndex: ["requestInfo", "uri"],
    ellipsis: true,
  },
  {
    title: "客户端IP",
    dataIndex: ["clientInfo", "ip"],
    width: '200px',
    ellipsis: true,
  },
  {
    title: "请求时间",
    dataIndex: "reqTimeDisplay",
    width: '180px',
    minWidth: '180px',
  },
  {
    title: "请求耗时",
    dataIndex: "millisCost",
    width: '100px',
  },
  {
    title: "响应状态码",
    key: 'repsonseInfoCode',
    dataIndex: ["responseInfo", "code"],
    width: '100px',
  },
]

const paginationConf = reactive({ ...DefaultPaginationConf })

const searchAccessLogs = (envId, pageNum, pageSize) => {
  AccessLogService.searchAccessLogs(envId, pageNum, pageSize).then((data) => {
    accessLogs.value = data.data
    paginationConf.total = data.total
    paginationConf.current = data.pageNum
    paginationConf.pageSize = data.pageSize
  })
}

const envChanged = (envId) => {
  contextEnvId.value = envId
  searchAccessLogs(contextEnvId.value, paginationConf.current, paginationConf.pageSize)
}

const tableChanged = (changedPaginationConf) => {
  searchAccessLogs(contextEnvId.value, changedPaginationConf.current, changedPaginationConf.pageSize)
}

onMounted(() => {
  EnvironmentService.getEnvironments().then((data) => {
    environmentOptions.value = data
    contextEnvId.value = data[0].id
    searchAccessLogs(contextEnvId.value, paginationConf.current, paginationConf.pageSize)
  })
})
</script>