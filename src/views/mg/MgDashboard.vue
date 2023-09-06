<template>
  <a-layout>
    <rgw-breadcrumb title="首页" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="仪表板">
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

    <a-row type="flex" justify="center" :gutter="[20, 20]" style="margin-top: 20px;">
      <a-col :span="4">
        <num-card label="API总数" :value="apisCount" style="background-color: lightsteelblue; color: darkblue;" />
      </a-col>
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
      <a-col :span="4">
        <num-card label="上行流量" :value="apiCallsCount.upFlow"
          style="background-color: lightsteelblue; color: darkslategrey" />
      </a-col>
      <a-col :span="4">
        <num-card label="下行流量" :value="apiCallsCount.downFlow"
          style="background-color: lightsteelblue; color: darkslategrey" />
      </a-col>
    </a-row>
  </a-layout>
</template>

<script setup>
import NumCard from "@/components/NumCard.vue"
import { EnvironmentService } from "@/services/environmentService"
import { DashboardService } from "@/services/dashboardService"
import { ref, onMounted } from "vue"

const environmentOptions = ref([])
const contextEnvId = ref('')

const apisCount = ref(0)
const apiCallsCount = ref({})

const getApisCount = () => {
  DashboardService.getApisCount(contextEnvId.value).then((data) => {
    apisCount.value = data
  })
}

const getApiCallsCount = () => {
  DashboardService.getApiCallsCount(contextEnvId.value).then((data) => {
    apiCallsCount.value = data
  })
}

const envChanged = (envId) => {
  contextEnvId.value = envId
  initData()
}

const initData = () => {
  getApisCount()
  getApiCallsCount()
}

onMounted(() => {
  EnvironmentService.getEnvironments().then((data) => {
    environmentOptions.value = data
    contextEnvId.value = data[0].id
    initData()
  })
})

</script>