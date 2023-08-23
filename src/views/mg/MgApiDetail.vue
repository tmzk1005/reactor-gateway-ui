<template>
  <a-layout>
    <rgw-breadcrumb title="API详情" :links="[{ name: 'API', path: RoutePaths.mgApi }]" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header class="section-container">

          <template #title>
            <span class="section-level-1">API基本信息</span>
          </template>

          <a-descriptions bordered :column="2" :label-style="labelStyle">
            <a-descriptions-item label="名称">
              <span style="font-weight: 700;">
                {{ api.name }}
              </span>
            </a-descriptions-item>

            <a-descriptions-item label="ID">
              <span style="font-weight: 700;">
                {{ api.id }}
              </span>
            </a-descriptions-item>

            <a-descriptions-item label="标签" :span="2" v-if="api.tags">
              <a-tag v-for="tag in api.tags" v-bind:key="tag" :color="'green'">
                {{ tag }}
              </a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="描述" :span="2">
              {{ api.description }}
            </a-descriptions-item>

            <a-descriptions-item label="创建时间">
              {{ api.createdDate }}
            </a-descriptions-item>

            <a-descriptions-item label="最后修改时间">
              {{ api.lastModifiedDate }}
            </a-descriptions-item>

            <a-descriptions-item label="所属组织" v-if="api.organization">
              {{ api.organization.name }}
            </a-descriptions-item>

          </a-descriptions>

        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header class="section-container" title="各环境发布快照">

          <a-tabs type="card" @change="tabChanged">
            <a-tab-pane v-for="snapshot in snapshots" :key="snapshot.index">

              <template #tab>
                <span v-if="snapshot.env == null">当前保存</span>
                <span v-else>
                  <a-space>
                    <span> {{ snapshot.env.name }}</span>
                    <a-tag :color="colorPublishStatus(snapshot.publishStatus)">
                      {{ snapshot.publishStatusDisplay }}
                    </a-tag>
                  </a-space>
                </span>
              </template>

              <a-row type="flex" justify="center" v-if="snapshot.env != null">
                <a-col :span="24">
                  <a-page-header class="section-container">

                    <template #title>
                      <span class="section-level-2"> {{ snapshot.env.name }}</span>
                    </template>

                    <a-descriptions bordered :column="2" :label-style="labelStyle">
                      <a-descriptions-item label="发布状态">
                        <a-tag :color="colorPublishStatus(snapshot.publishStatus)">
                          {{ snapshot.publishStatusDisplay }}
                        </a-tag>
                      </a-descriptions-item>

                      <a-descriptions-item label="环境">
                        <span>
                          {{ snapshot.env.name }}
                        </span>
                      </a-descriptions-item>

                      <a-descriptions-item label="发布者">
                        <span>
                          {{ snapshot.publisherName }}
                        </span>
                      </a-descriptions-item>

                      <a-descriptions-item label="发布时间">
                        <span>
                          {{ snapshot.lastModifiedDate }}
                        </span>
                      </a-descriptions-item>
                    </a-descriptions>

                  </a-page-header>
                </a-col>
              </a-row>

              <a-row type="flex" justify="center" v-else>
                <a-col :span="24">
                  <a-page-header class="section-container">

                    <template #title>
                      <span class="section-level-2">最后修改</span>
                    </template>

                    <a-descriptions bordered :column="1" :label-style="labelStyle">
                      <a-descriptions-item label="最后修改时间">
                        <span>
                          {{ snapshot.lastModifiedDate }}
                        </span>
                      </a-descriptions-item>
                    </a-descriptions>

                  </a-page-header>
                </a-col>
              </a-row>

              <a-row type="flex" justify="center">
                <a-col :span="24">
                  <a-page-header class="section-container">

                    <template #title>
                      <span class="section-level-2">请求方法和路径2</span>
                    </template>

                    <a-descriptions bordered :column="2" :label-style="labelStyle">
                      <a-descriptions-item label="请求方法" v-if="snapshot.routeDefinition">
                        <a-tag v-for="method in snapshot.routeDefinition.methods" v-bind:key="method"
                          :color="colorForHttpMethod(method)">
                          {{ method }}
                        </a-tag>
                      </a-descriptions-item>

                      <a-descriptions-item label="请求路径" v-if="snapshot.routeDefinition">
                        <span>
                          {{ snapshot.routeDefinition.path }}
                        </span>
                      </a-descriptions-item>
                    </a-descriptions>
                  </a-page-header>
                </a-col>
              </a-row>

              <a-row type="flex" justify="center">
                <a-col :span="24">
                  <a-page-header class="section-container">

                    <template #title>
                      <span class="section-level-2">处理流程</span>
                    </template>

                    <div class="plugin-container" :id="`jsplumb-container-${snapshot.index}`">

                      <a-popover v-for="(plugin, pluginIndex) in snapshot.routeDefinition.pluginDefinitions"
                        :data="plugin" :key="plugin.id" placement="topLeft" color="cornsilk">
                        <div class="plugin-item" :id="`plugin-${snapshot.index}-${pluginIndex}`">
                          <div class="plugin-name">{{ plugin.name }}</div>
                          <div class="plugin-version">{{ plugin.version }}</div>
                        </div>
                        <template #content>
                          <a-descriptions bordered :column="1" :label-style="labelStyle">
                            <a-descriptions-item label="插件名称">
                              <span>
                                {{ plugin.name }}
                              </span>
                            </a-descriptions-item>

                            <a-descriptions-item label="插件版本">
                              <span>
                                {{ plugin.version }}
                              </span>
                            </a-descriptions-item>
                          </a-descriptions>

                          <a-card style="margin-top: 10px;">
                            <template #title>
                              <span style="font-weight: 500;">JSON配置</span>
                            </template>
                            <highlightjs language="json" :code="JSON.stringify(JSON.parse(plugin.jsonConf), null, 4)" />
                          </a-card>
                        </template>
                      </a-popover>
                    </div>
                  </a-page-header>
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
import { nextTick, ref } from 'vue'
import { RoutePaths } from '@/utils/pathConstants'
import { ApiService } from "@/services/apiService"
import { colorForHttpMethod } from "@/utils/bizConstants"
import { newInstance, StraightConnector, BlankEndpoint } from "@jsplumb/browser-ui"

const props = defineProps({
  apiId: String
})
const labelStyle = {
  width: '140px'
}

const colorPublishStatus = (publishStatus) => {
  if (publishStatus == "PUBLISHED") {
    return 'green'
  } else if (publishStatus == "NOT_UPDATED") {
    return 'orange'
  } else {
    return null
  }
}

const api = ref({})

const snapshots = ref([])

const getApi = (id) => {
  ApiService.getApiById(id).then((data) => {
    api.value = data
    const arr = []
    var index = 0
    arr.push({
      index: index,
      env: null,
      lastModifiedDate: api.value.lastModifiedDate,
      routeDefinition: api.value.routeDefinition
    })
    for (var key in api.value.publishSnapshots) {
      index += 1
      let ps = api.value.publishSnapshots[key]
      ps.index = index
      arr.push(ps)
    }
    snapshots.value = arr
    tabChanged(0)
  })
}

getApi(props.apiId)

const jsplumbStatus = {}

const tabChanged = (key) => {
  // console.log(`tab changed to ${key}`)
  if (jsplumbStatus[key]) {
    // console.log(`Skip jsplumb arrow drawing for ${key}`)
    return
  }
  jsplumbStatus[key] = true

  nextTick(() => {
    let container = newInstance({ container: document.getElementById(`jsplumb-container-${key}`) })

    for (var i = 0; i < snapshots.value[key].routeDefinition.pluginDefinitions.length - 1; ++i) {
      container.connect(
        {
          source: document.getElementById(`plugin-${key}-${i}`),
          target: document.getElementById(`plugin-${key}-${i + 1}`),
          connector: StraightConnector.type,
          endpoint: BlankEndpoint.type,
          anchor: ['Left', 'Right'],
          overlays: [
            { type: "Arrow", options: { width: 10, length: 14, location: 1 } },
          ]
        }
      )
    }
  })
}

</script>

<style scoped>
.section-container {
  border: 1px solid rgb(235, 237, 240);
  margin-top: 10px;
}

.section-level-1 {
  font-size: 20px;
  font-weight: 700;
  color: black
}

.section-level-2 {
  font-size: 17px;
  font-weight: 600;
  color: cornflowerblue;
}

.plugin-container {
  padding: 20px;
  overflow: auto;
  border: 1px solid #ccc;
  background-color: #fdfdfd;
  box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.3);
  transform: translateZ(10px);
}

.plugin-item {
  width: 200px;
  display: inline-block;
  padding: 10px;
  margin: 10px 30px;
  border: 1px solid #111;
  background-color: bisque;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  transform: translateZ(1px);
}

.plugin-item:hover {
  box-shadow: 4px 4px 4px 4px rgba(33, 127, 175, 0.3);
  transform: translateZ(4px);
}

.plugin-name {
  padding: 10px;
  font-size: 1.2rem;
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.plugin-version {
  padding-left: 10px;
  padding-bottom: 10px;
  font-weight: 400;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>