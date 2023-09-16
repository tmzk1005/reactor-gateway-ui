<template>
  <a-layout>
    <rgw-breadcrumb title="API详情" :links="[{ name: 'API', path: RoutePaths.mgApi }]" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header class="section-container">

          <template #title>
            <span class="section-level-1">API基本信息</span>
          </template>

          <template #extra>
            <a-button type="primary" @click="editApi(api.id)">修改</a-button>
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

          <a-tabs type="card" @change="tabChanged" v-model:activeKey="activeTabIndex">
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

              <a-row type="flex" justify="center" v-if="snapshot.index == 0">
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

              <a-row type="flex" justify="center" v-else>
                <a-col :span="24">
                  <a-page-header class="section-container">

                    <template #title>
                      <span class="section-level-2"> {{ snapshot.env.name }}</span>
                    </template>

                    <template #extra>

                      <a-tooltip placement="topLeft" arrow-point-at-center title="点击查看API的高级配置"
                        v-if="snapshot.publishStatus != 'UNPUBLISHED'">
                        <a-button type="link" @click="showAdvanceConf(snapshot)">高级配置</a-button>
                      </a-tooltip>

                      <a-tooltip placement="topLeft" arrow-point-at-center title="点击查看API的历史调用情况">
                        <a-button type="link">历史调用</a-button>
                      </a-tooltip>

                      <a-popconfirm :title="`确认从${snapshot.env.name}下线API吗?`" ok-text="确认" cancel-text="取消"
                        v-if="snapshot.publishStatus != 'UNPUBLISHED'" @confirm="unpublishApi(api.id, snapshot.env.id)">
                        <a-button type="primary" danger :icon="h(DownloadOutlined)">{{ `下线[${snapshot.env.name}]`
                        }}</a-button>
                      </a-popconfirm>

                      <a-popconfirm :title="`确认发布API到${snapshot.env.name}吗?`" ok-text="确认" cancel-text="取消"
                        v-if="snapshot.publishStatus == 'UNPUBLISHED'" @confirm="publishApi(api.id, snapshot.env.id)">
                        <a-button type="primary" :icon="h(UploadOutlined)">{{ `发布[${snapshot.env.name}]` }}</a-button>
                      </a-popconfirm>

                      <a-popconfirm :title="`确认发布修改后的API到${snapshot.env.name}吗?`" ok-text="确认" cancel-text="取消"
                        v-if="snapshot.publishStatus == 'NOT_UPDATED'" @confirm="publishApi(api.id, snapshot.env.id)">
                        <a-button type="primary" :icon="h(UploadOutlined)">{{ `更新[${snapshot.env.name}]` }}</a-button>
                      </a-popconfirm>

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

                      <a-descriptions-item label="发布者" v-if="snapshot.publishStatus != 'UNPUBLISHED'">
                        <span>
                          {{ snapshot.publisherName }}
                        </span>
                      </a-descriptions-item>

                      <a-descriptions-item label="发布时间" v-if="snapshot.publishStatus != 'UNPUBLISHED'">
                        <span>
                          {{ snapshot.lastModifiedDate }}
                        </span>
                      </a-descriptions-item>
                    </a-descriptions>

                  </a-page-header>
                </a-col>
              </a-row>

              <a-row type="flex" justify="center"
                v-if="snapshot.index == 0 || snapshot.publishStatus == 'PUBLISHED' || snapshot.publishStatus == 'NOT_UPDATED'">
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

              <a-row type="flex" justify="center"
                v-if="snapshot.publishStatus != 'UNPUBLISHED' && snapshot.routeDefinition != null">
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

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-modal width="80%" title="高级配置" :footer="null" v-model:open="advanceConfDialogVisiable">
          <a-page-header class="section-container">
            <template #title>
              <span class="section-level-2">访问日志配置</span>
            </template>
            <a-descriptions bordered size="small" :column="2" :label-style="labelStyle">
              <a-descriptions-item label="开启" :span="2">
                <span>
                  {{ advanceConf.accessLogConf != null ? '是' : '否' }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="请求头" v-if="advanceConf.accessLogConf != null">
                <span>
                  {{ advanceConf.accessLogConf.reqHeadersEnabled ? '是' : '否' }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="请求体" v-if="advanceConf.accessLogConf != null">
                <span>
                  {{ advanceConf.accessLogConf.reqBodyEnabled ? '是' : '否' }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="响应头" v-if="advanceConf.accessLogConf != null">
                <span>
                  {{ advanceConf.accessLogConf.respHeadersEnabled ? '是' : '否' }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="响应体" v-if="advanceConf.accessLogConf != null">
                <span>
                  {{ advanceConf.accessLogConf.respBodyEnabled ? '是' : '否' }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="大小上限" v-if="advanceConf.accessLogConf != null">
                <span>
                  {{ advanceConf.accessLogConf.bodyLimit }} 字节
                </span>
              </a-descriptions-item>
            </a-descriptions>
          </a-page-header>

          <a-page-header class="section-container">
            <template #title>
              <span class="section-level-2">APP认证配置</span>
            </template>
            <a-descriptions bordered size="small" :column="2" :label-style="labelStyle">
              <a-descriptions-item label="开启">
                <span>
                  {{ advanceConf.appAuthConf.enabled ? '是' : '否' }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="请求体防篡改" v-if="advanceConf.appAuthConf.enabled">
                <span>
                  {{ advanceConf.appAuthConf.bodyTamperProofingEnabled ? '是' : '否' }}
                </span>
              </a-descriptions-item>
            </a-descriptions>
          </a-page-header>
        </a-modal>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script setup>
import { nextTick, ref, h, reactive } from 'vue'
import { RouteNames, RoutePaths } from '@/utils/pathConstants'
import { ApiService } from "@/services/apiService"
import { colorForHttpMethod } from "@/utils/bizConstants"
import { newInstance, StraightConnector, BlankEndpoint } from "@jsplumb/browser-ui"
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { notification } from "ant-design-vue"
import { useRouter } from "vue-router"

const router = useRouter()

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
    return 'red'
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
    let envIds = Object.getOwnPropertyNames(api.value.publishSnapshots).sort()
    for (var i in envIds) {
      index += 1
      let ps = api.value.publishSnapshots[envIds[i]]
      ps.index = index
      arr.push(ps)
    }
    snapshots.value = arr
    tabChanged(activeTabIndex.value)
  })
}

getApi(props.apiId)

const activeTabIndex = ref(0)
let jsplumbStatus = {}
let jsplumbContainers = []

const tabChanged = (key) => {
  // console.log(`tab changed to ${key}`)
  if (jsplumbStatus[key]) {
    // console.log(`Skip jsplumb arrow drawing for ${key}`)
    return
  }
  if (!snapshots.value[key].routeDefinition) {
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

const advanceConfDialogVisiable = ref(false)
const advanceConf = reactive({
  accessLogConf: null,
  appAuthConf: {
    enabled: false,
    bodyTamperProofingEnabled: false,
  }
})
const showAdvanceConf = (snapshot) => {
  // console.log("show advance conf", snapshot)
  if (snapshot.routeDefinition.accessLogConf) {
    advanceConf.accessLogConf = { ...snapshot.routeDefinition.accessLogConf }
  } else {
    advanceConf.accessLogConf = null
  }
  if (snapshot.routeDefinition.appAuthConf) {
    advanceConf.appAuthConf = { ...snapshot.routeDefinition.appAuthConf }
  } else {
    advanceConf.appAuthConf = {
      enabled: false,
      bodyTamperProofingEnabled: false,
    }
  }
  advanceConfDialogVisiable.value = true
}

const apiInfoMayUpdated = () => {
  if (jsplumbContainers) {
    for (var i = 0; i < jsplumbContainers.length; ++i) {
      jsplumbContainers[i].reset()
    }
  }
  jsplumbStatus = {}
  getApi(props.apiId)
}

const publishApi = (apiId, envId) => {
  ApiService.publishApi(apiId, envId).then(() => {
    notification.success({ message: "发布API成功" })
    apiInfoMayUpdated()
  })
}

const unpublishApi = (apiId, envId) => {
  ApiService.unpublishApi(apiId, envId).then(() => {
    notification.success({ message: "下线API成功" })
    apiInfoMayUpdated()
  })
}

const editApi = (apiId) => {
  router.push({
    name: RouteNames.mgApiUpdate,
    params: { apiId: apiId }
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