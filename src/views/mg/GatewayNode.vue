<template>
  <a-layout>

    <rgw-breadcrumb title="网关节点" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="网关节点">

          <a-tabs type="card" :activeTabKey="activeEnvId">
            <a-tab-pane v-for="(gatewayNodes, envId) in allGatewayNodes" :key="envId">

              <template #tab>
                <span>{{ gatewayNodes[0].environment.name }}</span>
              </template>

              <a-row :gutter="[16, 16]" :wrap="true" style="padding: 0 40px 0 40px; margin: 0">
                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" :xxl="8" v-for="node in gatewayNodes" :key="node.id">
                  <a-card type="inner" class="node-card">
                    <template #title>
                      <a-typography-title class="node-title" :level="4">{{ node.address }}</a-typography-title>
                    </template>

                    <template #extra>
                      <a-tag :color="timePastColor(node.timePast)">
                        {{ stateDisplay(node.timePast) }}
                      </a-tag>
                    </template>

                    <div class="node-container">
                      <a-descriptions :bordered="true" size="small" :column="1" :labelStyle="{ width: '120px' }">
                        <a-descriptions-item label="节点ID">{{ node.id }}</a-descriptions-item>
                        <a-descriptions-item label="最近心跳时间">
                          <a-space>
                            <span> {{ node.heartbeatDisplay }}</span>
                            <a-tag :color="timePastColor(node.timePast)">
                              {{ node.timePast }} 秒前
                            </a-tag>
                          </a-space>
                        </a-descriptions-item>
                      </a-descriptions>
                    </div>
                  </a-card>
                </a-col>
              </a-row>

            </a-tab-pane>
          </a-tabs>

        </a-page-header>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import { GatewayNodeService } from "@/services/gatewayNodeService"
import { onUnmounted, ref } from "vue"

const allGatewayNodes = ref({})
const activeEnvId = ref("")

const timePastColor = function (timePast) {
  if (timePast <= 60) {
    return "green"
  } else if (timePast <= 120) {
    return "orange"
  } else {
    return "red"
  }
}

const stateDisplay = function (timePast) {
  if (timePast <= 60) {
    return "在线"
  } else if (timePast <= 120) {
    return "可能离线"
  } else {
    return "离线"
  }
}

const listAllGatewayNodes = () => {
  GatewayNodeService.listGatewayNodes("").then((data) => {
    var cur = new Date().getTime()
    for (var envId in data) {
      for (var i = 0; i < data[envId].length; ++i) {
        var node = data[envId][i]
        node['timePast'] = parseInt((cur - node['heartbeat']) / 1000)
      }
    }
    allGatewayNodes.value = data
  })
}
listAllGatewayNodes()

const pollAllGatewayNodes = setInterval(listAllGatewayNodes, 10 * 1000)
const tick = setInterval(() => {
  for (var envId in allGatewayNodes.value) {
    for (var i = 0; i < allGatewayNodes.value[envId].length; ++i) {
      var node = allGatewayNodes.value[envId][i]
      node['timePast'] += 1
    }
  }
}, 1000)

onUnmounted(() => {
  clearInterval(pollAllGatewayNodes)
  clearInterval(tick)
})
</script>

<style scoped>
:deep(.node-card .node-title) {
  margin-top: 12px;
}

.node-container {
  height: 150px;
  max-height: 150px;
  overflow: hidden
}
</style>
