<template>
  <div>
    <a-row type="flex" justify="center" :gutter="[20, 20]" style="margin-top: 20px;">
      <a-col :span="4">
        <num-card label="总调用数" :value="apiCallsCount.totalCount"
          style="background-color: lightsteelblue; color: darkslategrey;" />
      </a-col>
      <a-col :span="4">
        <num-card label="成功调用数" :value="apiCallsCount.succeedCount"
          style="background-color: lightsteelblue; color: darkgreen" />
      </a-col>
      <a-col :span="4">
        <num-card label="失败调用数" :value="apiCallsCount.failedCount"
          style="background-color: lightsteelblue; color: darkred" />
      </a-col>
      <a-col :span="6">
        <num-card label="上行流量" :value="apiCallsCount.upFlow"
          style="background-color: lightsteelblue; color: darkslategrey" />
      </a-col>
      <a-col :span="6">
        <num-card label="下行流量" :value="apiCallsCount.downFlow"
          style="background-color: lightsteelblue; color: darkslategrey" />
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" style="padding-top: 20px;">
      <a-col :span="24">
        <div style="vertical-align: bottom;">
          <span style="font-size: 1.2rem; font-weight: 700;">API调用统计</span>
          <span style="font-size: 1rem; font-weight: normal; margin-left: 30px;">
            <a-radio-group v-model:value="timeRangeType" size="small" @change="getApiCallsCountTrend">
              <a-radio-button value="LAST_HOUR">最近1小时</a-radio-button>
              <a-radio-button value="LAST_DAY">最近24小时</a-radio-button>
              <a-radio-button value="LAST_MONTH">最近1月</a-radio-button>
            </a-radio-group>
          </span>
        </div>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" style="height: 300px;">
      <a-col :span="24">
        <line-chart class="chart" :title="trendOfCount.title" :x-axis-name="trendOfCount.xAxis.name"
          :color="colorsForStatusCode" :y-axis-name="trendOfCount.yAxis.name" :x-axis-data="trendOfCount.xAxis.data"
          :series="trendOfCount.series" />
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" style="height: 300px; padding-top: 20px;">
      <a-col :span="24">
        <line-chart class="chart" :title="trendOfDelay.title" :x-axis-name="trendOfDelay.xAxis.name"
          :y-axis-name="trendOfDelay.yAxis.name" :x-axis-data="trendOfDelay.xAxis.data" :series="trendOfDelay.series" />
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" style="height: 300px; padding-top: 20px; padding-bottom: 30px;">
      <a-col :span="24">
        <line-chart class="chart" :title="trendOfFlow.title" :x-axis-name="trendOfFlow.xAxis.name"
          :y-axis-name="trendOfFlow.yAxis.name" :x-axis-data="trendOfFlow.xAxis.data" :series="trendOfFlow.series" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { DashboardService } from "@/services/dashboardService"

const props = defineProps({
  envId: String,
  apiId: String
})

const colorsForStatusCode = ['#5470c6', '#3ba272', '#ee6666', '#91cc75', '#fc8452', '#fac858', '#73c0de', '#9a60b4', '#ea7ccc']

const timeRangeType = ref('LAST_HOUR')
const apiCallsCount = ref({})

const trendOfCount = reactive({
  title: '',
  xAxis: {},
  yAxis: {},
  series: []
})

const trendOfDelay = reactive({
  title: '',
  xAxis: {},
  yAxis: {},
  series: []
})

const trendOfFlow = reactive({
  title: '',
  xAxis: {},
  yAxis: {},
  series: []
})

const getApiCallsCount = () => {
  DashboardService.getApiCallsCount(props.envId, null, props.apiId).then((data) => {
    apiCallsCount.value = data
  })
}

const getApiCallsCountTrend = () => {
  DashboardService.getApiCallsCountTrend(props.envId, null, props.apiId, timeRangeType.value).then((data) => {
    trendOfCount.title = data.apiCallsCountTrend.title
    trendOfCount.xAxis = data.apiCallsCountTrend.xAxis
    trendOfCount.yAxis = data.apiCallsCountTrend.yAxis
    trendOfCount.series = data.apiCallsCountTrend.series

    trendOfDelay.title = data.apiCallsDelayTrend.title
    trendOfDelay.xAxis = data.apiCallsDelayTrend.xAxis
    trendOfDelay.yAxis = data.apiCallsDelayTrend.yAxis
    trendOfDelay.series = data.apiCallsDelayTrend.series

    trendOfFlow.title = data.apiCallsFlowTrend.title
    trendOfFlow.xAxis = data.apiCallsFlowTrend.xAxis
    trendOfFlow.yAxis = data.apiCallsFlowTrend.yAxis
    trendOfFlow.series = data.apiCallsFlowTrend.series
  })
}

getApiCallsCount()
getApiCallsCountTrend()
</script>