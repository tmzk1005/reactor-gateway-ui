<template>
  <a-layout>
    <rgw-breadcrumb title="API订阅申请" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="API订阅申请">
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-table :dataSource="apiSubscribeList" :columns="apiSubscribeFields" rowKey="id" :pagination="paginationConf">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'state'">
              <span>
                <a-tag :color="ApplyStates[record.state].color">
                  {{ ApplyStates[record.state].display }}
                </a-tag>
              </span>
            </template>

            <template v-else-if="column.dataIndex === 'handleTime'">
              <span>
                {{ record.state == 'CREATED' ? '-' : record.handleTime }}
              </span>
            </template>

            <template v-else-if="column.key === 'action' && sessionStore.isNormalUser">
              <a-space>
                <a-button type="link" class="action-btn" :style="{ color: record.state != 'CREATED' ? 'gray' : 'green' }"
                  :disabled="record.state != 'CREATED'" @click="approve(record)">
                  <template #icon>
                    <check-circle-outlined style="padding: 0; margin: 0;" />
                  </template>
                  通过
                </a-button>
                <a-button type="link" class="action-btn" :style="{ color: record.state != 'CREATED' ? 'gray' : 'red' }"
                  :disabled="record.state != 'CREATED'" @click="reject(record)">
                  <template #icon>
                    <close-circle-outlined style="padding: 0; margin: 0;" />
                  </template>
                  拒绝
                </a-button>
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
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { notification } from "ant-design-vue"
import { DefaultPaginationConf } from "@/utils/bizConstants"
import { SubscriptionService } from "@/services/subscriptionService"
import { useSessionStore } from "@/stores/session"

const sessionStore = useSessionStore()

const paginationConf = reactive({ ...DefaultPaginationConf })

const apiSubscribeList = ref([])

const apiSubscribeFields = [
  {
    title: "应用",
    dataIndex: "appName"
  },
  {
    title: "API名称",
    dataIndex: "apiName"
  },
  {
    title: "申请时间",
    dataIndex: "applyTime"
  },
  {
    title: "处理时间",
    dataIndex: "handleTime"
  },
  {
    title: "状态",
    dataIndex: "state"
  }
]

if (sessionStore.isNormalUser) {
  apiSubscribeFields.push({
    title: "操作",
    key: "action"
  })
}

const ApplyStates = {
  CREATED: {
    color: 'blue',
    display: '待审核'
  },
  PERMITTED: {
    color: 'green',
    display: '已通过'
  },
  REJECTED: {
    color: 'red',
    display: '已拒绝'
  }
}

const getApiSubscribeList = (pageNum, pageSize) => {
  SubscriptionService.listHistory(pageNum, pageSize).then((pageData) => {
    apiSubscribeList.value = pageData.data
    paginationConf.total = pageData.total
    paginationConf.current = pageData.pageNum
    paginationConf.pageSize = pageData.pageSize
  })
}

getApiSubscribeList(paginationConf.current, paginationConf.pageSize)

const approve = (sub) => {
  SubscriptionService.approve(sub.id).then((data) => {
    notification.success({ message: `已通过应用 [${sub.appName}] 对API [${sub.apiName}] 的访问申请` })
    sub.state = data.state
    sub.handleTime = data.handleTime
  })
}

const reject = (sub) => {
  SubscriptionService.reject(sub.id).then((data) => {
    notification.success({ message: `已拒绝应用 [${sub.appName}] 对API [${sub.apiName}] 的访问申请` })
    sub.state = data.state
    sub.handleTime = data.handleTime
  })
}

</script>

<style scoped>
.action-btn {
  padding: 0;
}
</style>