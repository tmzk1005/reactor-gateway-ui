<template>
  <a-layout>
    <rgw-breadcrumb title="我的申请" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="我的API访问申请">
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
          </template>``
        </a-table>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import { reactive, ref } from "vue"
import { DefaultPaginationConf } from "@/utils/bizConstants"
import { SubscriptionService } from "@/services/subscriptionService"

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

const ApplyStates = {
  CREATED: {
    color: 'blue',
    display: '审核中'
  },
  PREMITTED: {
    color: 'green',
    display: '已通过'
  },
  REJECTED: {
    color: 'red',
    display: '已拒绝'
  }
}

const getApiSubscribeList = (pageNum, pageSize) => {
  SubscriptionService.listHistoryAsSubscriber(pageNum, pageSize).then((pageData) => {
    apiSubscribeList.value = pageData.data
    paginationConf.total = pageData.total
    paginationConf.current = pageData.pageNum
    paginationConf.pageSize = pageData.pageSize
  })
}

getApiSubscribeList(paginationConf.current, paginationConf.pageSize)

</script>