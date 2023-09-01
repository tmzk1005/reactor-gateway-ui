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

    <a-row type="flex" justify="center" class="access-log-search-form">
      <a-col :span="24">
        <a-form ref="searchConditionsFrom" name="accessLogSearch" :model="searchConditions" :labelCol="{ span: 8 }"
          @finish="searchAccessLogs(contextEnvId, 1, paginationConf.pageSize)">
          <a-row>
            <a-col :span="8">
              <a-form-item label="请求标识ID" name="requestId">
                <a-input v-model:value="searchConditions.requestId" placeholder="请求标识ID" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="API名称或ID" name="apiName">
                <a-input v-model:value="searchConditions.apiName" placeholder="API名称或ID" />
              </a-form-item>
            </a-col>
            <a-col :span="8" style="text-align: right">
              <a @click="searchConditionsFromExpand = !searchConditionsFromExpand" style="margin-right: 10px;">
                <template v-if="searchConditionsFromExpand">
                  <up-outlined />
                </template>
                <template v-else>
                  <down-outlined />
                </template>
                更多条件
              </a>
              <a-button size="small" type="primary" html-type="submit">查询</a-button>
              <a-button size="small" style="margin: 0 8px" @click="searchConditionsFromReset">重置</a-button>
            </a-col>
          </a-row>

          <a-row v-if="searchConditionsFromExpand">
            <a-col :span="8">
              <a-form-item label="客户端IP" name="clientIp">
                <a-input v-model:value="searchConditions.clientIp" placeholder="客户端IP" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="客户端应用名称或ID" name="clientName">
                <a-input v-model:value="searchConditions.clientName" placeholder="客户端应用名称或ID" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="请求耗时[下限]" name="timeCostMillis">
                <a-input-number v-model:value="searchConditions.timeCostMillis" addon-after="毫秒" style="width: 100%;"
                  placeholder="请求耗时" :min="0" :step="1000">
                  <template #suffix>
                    毫秒
                  </template>
                </a-input-number>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row v-if="searchConditionsFromExpand">
            <a-col :span="8">
              <a-form-item label="响应状态码" name="responseStatus">
                <a-tree-select v-model:value="searchConditions.responseStatus" style="width: 100%"
                  :tree-data="StatusCodeTreeData" tree-checkable allow-clear
                  :show-checked-strategy="TreeSelect.SHOW_PARENT" placeholder="选择要过滤的状态码">
                  <template #tagRender="{ label, closable, onClose, option }">
                    <a-tag :closable="closable" :color="option.color" @close="onClose">
                      {{ label }}
                    </a-tag>
                  </template>
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="请求时间范围" name="requqestTime">
                <a-range-picker v-model:value="searchConditions.requestTime" style="width: 400px" :locale="locale"
                  show-time format="YYYY-MM-DD HH:mm:ss" :disabledDate="disableDays30DayAgo">
                  <template #renderExtraFooter>
                    <a-space>
                      <a-button type="primary" size="small" @click="setTimeRange(dayjs().add(-15, 'minute'), dayjs())">
                        最近15分钟
                      </a-button>
                      <a-button type="primary" size="small" @click="setTimeRange(dayjs().startOf('day'), dayjs())">
                        今天
                      </a-button>
                    </a-space>
                    <div></div>
                    <a-space>
                      <a-button type="primary" size="small" @click="setTimeRange(dayjs().add(-1, 'hour'), dayjs())">
                        最近1个小时
                      </a-button>
                      <a-button type="primary" size="small" @click="setTimeRange(dayjs().add(-6, 'hour'), dayjs())">
                        最近6个小时
                      </a-button>
                      <a-button type="primary" size="small" @click="setTimeRange(dayjs().add(-12, 'hour'), dayjs())">
                        最近12个小时
                      </a-button>
                      <a-button type="primary" size="small" @click="setTimeRange(dayjs().add(-24, 'hour'), dayjs())">
                        最近24小时
                      </a-button>
                    </a-space>
                    <div></div>
                    <a-space>
                      <a-button type="primary" size="small" @click="setTimeRange(dayjs().startOf('week'), dayjs())">
                        本周
                      </a-button>
                      <a-button type="primary" size="small" @click="setTimeRange(dayjs().add(-7, 'day'), dayjs())">
                        最近7天
                      </a-button>
                    </a-space>
                    <div></div>
                    <a-space>
                      <a-button type="primary" size="small" @click="setTimeRange(dayjs().startOf('month'), dayjs())">
                        本月
                      </a-button>
                      <a-button type="primary" size="small" @click="setTimeRange(dayjs().add(-30, 'day'), dayjs())">
                        最近30天
                      </a-button>
                    </a-space>
                  </template>
                </a-range-picker>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
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

            <template v-else-if="column.key === 'flowUp'">
              <flow-bytes-show :value="record.responseInfo.bodySize" />
            </template>

            <template v-else-if="column.key === 'flowDown'">
              <flow-bytes-show :value="record.responseInfo.bodySize" />
            </template>

            <template v-else-if="column.dataIndex === 'millisCost'">
              <time-cost :value="record.millisCost" />
            </template>

            <template v-else-if="column.key === 'repsonseInfoCode'">
              <a-tag :color="colorForResponseStatus(record.responseInfo.code)">
                {{ record.responseInfo.code }}
              </a-tag>
            </template>

            <template v-else-if="column.dataIndex == 'requestId'">
              <a-tooltip placement="topLeft" color="blue" title="点击查看详细日志">
                <a-button type="link" style="padding: 0;" @click="showAccessLogDetail(record)">
                  {{ record.requestId }}
                </a-button>
              </a-tooltip>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col>
        <a-modal width="80%" v-model:open="detailDialogVisible" :title="`访问日志详情 ${detailsToShow.requestId}`">
          <div style="max-height: calc(100vh - 320px); margin-top: 25px; overflow: auto;">
            <a-page-header class="section-container" title="请求"
              :sub-title="detailsToShow.requestInfo.bodyBase64 ? '请求体使用Base64编码' : ''">

              <a-descriptions :column="1" bordered :label-style="{ width: '100px', 'vertical-align': 'top' }">
                <a-descriptions-item label="请求行">
                  <span>
                    <a-tag :color="colorForHttpMethod(detailsToShow.requestInfo.method)">
                      {{ detailsToShow.requestInfo.method }}
                    </a-tag>
                  </span>
                  <span>{{ detailsToShow.requestInfo.uri }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="请求头">
                  <http-headers :headers="detailsToShow.requestInfo.headers" :key="'req' + detailsToShow.requestId" />
                </a-descriptions-item>
                <a-descriptions-item label="请求体">
                  <highlightjs class="http-content" autodetect :code="detailsToShow.requestInfo.body" />
                </a-descriptions-item>
              </a-descriptions>
            </a-page-header>

            <a-page-header class="section-container" title="响应"
              :sub-title="detailsToShow.responseInfo.bodyBase64 ? '响应体使用Base64编码' : ''">
              <a-descriptions :column="1" bordered :label-style="{ width: '100px', 'vertical-align': 'top' }">
                <a-descriptions-item label="响应码">
                  <a-tag :color="colorForResponseStatus(detailsToShow.responseInfo.code)">
                    {{ detailsToShow.responseInfo.code }}
                  </a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="响应头">
                  <http-headers :headers="detailsToShow.responseInfo.headers" :key="'resp' + detailsToShow.requestId" />
                </a-descriptions-item>
                <a-descriptions-item label="响应体">
                  <highlightjs class="http-content" autodetect :code="detailsToShow.responseInfo.body" />
                </a-descriptions-item>
              </a-descriptions>
            </a-page-header>

            <a-page-header class="section-container" title="扩展信息">
              <div v-if="detailsToShow.extraInfo && Object.getOwnPropertyNames(detailsToShow.extraInfo).length > 0"
                class="big-text-container">
                <a-descriptions :column="1" bordered :label-style="{ width: '100px', 'vertical-align': 'top' }"
                  v-for="keyName in detailsToShow.extraInfo" :key="`${detailsToShow.requestId}-${keyName}`">
                  <a-descriptions-item :label="keyName">
                    <highlightjs class="http-content" autodetect :code="JSON.stringify(detailsToShow.extraInfo[keyName], null, 4)" />
                  </a-descriptions-item>
                </a-descriptions>
              </div>
              <div v-else>
                <span style="color: chocolate;">无扩展信息</span>
              </div>
            </a-page-header>
          </div>

          <template #footer>
            <a-button type="primary" @click="detailDialogVisible = false">关闭</a-button>
          </template>
        </a-modal>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import TimeCost from "@/components/TimeCost.vue"
import FlowBytesShow from "@/components/FlowBytesShow.vue"
import HttpHeaders from "@/components/HttpHeaders.vue"
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import dayjs from "dayjs"
import { onMounted, reactive, ref } from 'vue'
import { DefaultPaginationConf } from "@/utils/bizConstants"
import { colorForResponseStatus } from "@/utils/formatter"
import { AccessLogService } from "@/services/accessLogService"
import { EnvironmentService } from "@/services/environmentService"
import { colorForHttpMethod, StatusCodeTreeData } from "@/utils/bizConstants"
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { TreeSelect } from 'ant-design-vue'
import { useRoute } from "vue-router"
import { RoutePaths } from "@/utils/pathConstants"

// -------------------- 模式 --------------------

// 注意，是userRoute(),不是useRouter(),没有'r'
const route = useRoute()
const asSubscriber = route.path == RoutePaths.mkAccessLog

// -------------------- 搜索条件 --------------------

const searchConditionsFrom = ref()
const searchConditionsFromExpand = ref(false)

const searchConditions = reactive({
  requestId: null,
  apiName: null,
  clientIp: null,
  clientName: null,
  responseStatus: [],
  timeCostMillis: 0,
  requestTime: null,
})

const searchConditionsFromReset = () => {
  searchConditionsFrom.value.resetFields()
}

const disableDays30DayAgo = (targetDate) => {
  let millis = new Date() - targetDate
  return millis < 0 || millis > 1000 * 3600 * 24 * 32
}

const setTimeRange = (start, end) => {
  searchConditions.requestTime = [start, end]
}

// -------------------- 数据展示 --------------------

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
    title: "请求路径",
    dataIndex: ["requestInfo", "uri"],
    ellipsis: true,
  },
  {
    title: "客户端IP",
    dataIndex: ["clientInfo", "ip"],
    width: '140px',
    ellipsis: true,
  },
  {
    title: "客户端应用名称",
    dataIndex: "clientAppName",
    width: '180px',
    ellipsis: true,
  },
  {
    title: "请求时间",
    dataIndex: "reqTimeDisplay",
    width: '180px',
    minWidth: '180px',
  },
  {
    title: "上行流量",
    key: "flowUp",
    dataIndex: ["requestInfo", "bodySize"],
    width: '100px',
    ellipsis: true,
  },
  {
    title: "下行流量",
    key: "flowDown",
    dataIndex: ["responseInfo", "bodySize"],
    width: '100px',
    ellipsis: true,
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
  let params = { asSubscriber: asSubscriber }
  for (let pName in searchConditions) {
    if (searchConditions[pName]) {
      params[pName] = searchConditions[pName]
    }
  }

  if (params['requestTime']) {
    params['minTimeMillis'] = params['requestTime'][0].valueOf()
    params['maxTimeMillis'] = params['requestTime'][1].valueOf()
    delete params['requestTime']
  }

  AccessLogService.searchAccessLogs(envId, pageNum, pageSize, params).then((data) => {
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

// -------------------- 模态框展示详情 --------------------

const detailDialogVisible = ref(false)

const detailsToShow = ref({})

const showAccessLogDetail = (accessLog) => {
  detailsToShow.value = accessLog
  detailDialogVisible.value = true
}

</script>

<style scoped>
.access-log-search-form {
  background-color: floralwhite;
  padding: 10px 10px;
  margin: 10px 0;
}

.section-container {
  margin: 20px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
}

pre {
  tab-size: 4;
}

.http-content {
  width: 100%;
  max-height: 500px;
  overflow: auto;
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
