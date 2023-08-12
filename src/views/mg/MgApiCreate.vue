<template>
  <a-layout>

    <rgw-breadcrumb title="新建API" :links="[{ name: 'API', path: RoutePaths.mgApi }]" />

    <div class="api-create-container">
      <div class="api-create-left">

        <api-plugin v-for="plugin in apiPlugins" :key="plugin.id" :draggable="plugin.draggable" v-show="!plugin.used"
          @dragstart="dragStartZone1($event, plugin)" @dragend="dragEndZone1($event)" :data="plugin">
        </api-plugin>

      </div>

      <div class="api-create-right">
        <a-row>
          <a-col :span="24">
            <a-page-header title="API基本信息" style="font-family: monospace;">
              <a-form>
                <a-row>
                  <a-col :span="8">
                    <a-form-item label="名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                      <a-input v-model:value="apiDto.name" placeholder="请输入API的名称" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="路径" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                      <a-input v-model:value="apiDto.path" placeholder="请输入HTTP请求路径" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="方法" name="methods" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                      <a-select mode="multiple" :show-arrow="true" v-model:value="apiDto.methods"
                        placeholder="请选择HTTP请求方法">
                        <a-select-option value="GET">GET</a-select-option>
                        <a-select-option value="POST">POST</a-select-option>
                        <a-select-option value="PUT">PUT</a-select-option>
                        <a-select-option value="DELETE">DELETE</a-select-option>
                        <a-select-option value="HEAD">HEAD</a-select-option>
                        <a-select-option value="PATCH">PATCH</a-select-option>
                        <a-select-option value="OPTIONS">OPTIONS</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row>
                  <a-col :span="8">
                    <a-form-item label="标签" name="tags" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                      <a-select v-model:value="apiDto.tags" mode="tags" :allow-clear="true" placeholder="给API打上标签方便查找和过滤"
                        :options="[]">
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="16">
                    <a-form-item label="描述" name="description" :label-col="{ span: 2 }" :wrapper-col="{ span: 18 }">
                      <a-input v-model:value="apiDto.description" placeholder="对API的功能做简要的描述" />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-page-header>
          </a-col>
        </a-row>

        <a-row style="padding-top: 20px;">
          <a-col :span="24">
            <a-page-header title="API处理流程" style="font-family: monospace; ">
              <div class="configuration-container" @drop="dragDropZone2($event)" @dragenter="dragEnterZone2($event)"
                @dragleave="dragLeaveZone2($event)" @dragover="dragOverZone2($event)">

                <api-plugin-instance v-for="plItem in pluginChain" :key="plItem.id"
                  :draggable="plItem.draggable && !plItem.tail" @dragstart="dragStartZone2($event, plItem)"
                  @dragend="dragEndZone2($event)" :data="plItem"
                  :style="{ 'pointer-events': plItem.preventEvents ? 'none' : 'all', border: plItem.temp ? 'dashed' : '' }">
                  <template #extra>
                    <a-button type="link" style="font-size: 1.1rem;">
                      <template #icon>
                        <setting-outlined style="padding: 0; margin: 0;" />
                      </template>
                      配置
                    </a-button>
                    <a-button type="link" style="font-size: 1.1rem;" @click="removeFormPluginChain(plItem.id)">
                      <template #icon>
                        <delete-outlined style="padding: 0; margin: 0;" />
                      </template>
                      删除
                    </a-button>
                  </template>
                </api-plugin-instance>

              </div>
            </a-page-header>
          </a-col>
        </a-row>

      </div>
    </div>

  </a-layout>
</template>

<script setup>
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { RoutePaths } from '@/utils/pathConstants'
import ApiPlugin from "@/components/api/ApiPlugin.vue"
import ApiPluginInstance from "@/components/api/ApiPluginInstance.vue"
import { reactive, ref } from 'vue'

const apiPlugins = ref([
  {
    id: "1",
    name: "rateLimit",
    nameDisplay: "限流",
    version: "1.0.0",
    description: "限制API的调用频率限制API的调用频率限制API的调用频率限制API的调用频率限制API的调用频率",
    tail: false,
    used: false,
    draggable: true,
  },
  {
    id: "2",
    name: "circuit-breaker",
    nameDisplay: "熔断",
    version: "1.0.0",
    description: "熔断",
    tail: false,
    used: false,
    draggable: true,
  },
  {
    id: "3",
    name: "auth",
    nameDisplay: "认证",
    version: "1.0.0",
    description: "认证",
    tail: false,
    used: false,
    draggable: true,
  },
  {
    id: "4",
    name: "Mock",
    nameDisplay: "Mock",
    version: "1.0.0",
    description: "Mock",
    tail: true,
    used: false,
    draggable: true,
  },
  {
    id: "5",
    name: "HTTP-route",
    nameDisplay: "HTTP转发",
    version: "1.0.0",
    description: "HTTP转发",
    tail: true,
    used: false,
    draggable: true,
  },
])

const findPluginInApiPlugins = (pId) => {
  for (var i = 0; i < apiPlugins.value.length; i++) {
    if (apiPlugins.value[i].id == pId) {
      return apiPlugins.value[i]
    }
  }
  return null
}

const setApiPluginUsed = (pId, used) => {
  let item = findPluginInApiPlugins(pId)
  if (item == null || item == undefined) {
    return
  }
  item.used = used
  return item
}

const pluginChain = ref([])

const apiDto = reactive({
  name: "",
  path: "",
  methods: [],
  tags: [],
  description: "",
})

const dragContext = {
  pluginType: null,
  pluginInstance: null,
  enteredZone2: false,
  pushedTempItem: false,
  fromZone: "",
}

const setPointerEventsOfZone2Children = (boolValue) => {
  for (var i = 0; i < pluginChain.value.length; ++i) {
    pluginChain.value[i].preventEvents = boolValue
    pluginChain.value[i].draggable = !boolValue && !pluginChain.value[i].tail
  }
}

const dragStartZone1 = (_, item) => {
  console.log('dragStartZone1')
  dragContext.pluginType = item
  dragContext.fromZone = '1'
  setPointerEventsOfZone2Children(true)
}

const dragStartZone2 = (_, item) => {
  console.log('dragStartZone2')
  dragContext.pluginInstance = item
  dragContext.fromZone = '2'
  setPointerEventsOfZone2Children(true)
}

const _dragEnd = (evt) => {
  evt.preventDefault()
  dragContext.enteredZone2 = false
  dragContext.pushedTempItem = false
  dragContext.pluginInstance = null
  setPointerEventsOfZone2Children(false)
  let tailPluginDraggable = true
  if (pluginChain.value.length != 0 && pluginChain.value[pluginChain.value.length - 1].tail) {
    tailPluginDraggable = false
  }
  for (var i = 0; i < apiPlugins.value.length; i++) {
    if (apiPlugins.value[i].tail) {
      apiPlugins.value[i].draggable = tailPluginDraggable
    } else {
      apiPlugins.value[i].draggable = true
    }
  }
}

const dragEndZone1 = (evt) => {
  console.log('dragEndZone1')
  return _dragEnd(evt)
}

const dragEndZone2 = (evt) => {
  console.log('dragEndZone2')
  return _dragEnd(evt)
}

const dragEnterZone2 = (evt) => {
  console.log('dragEnterZone2')
  console.log('dragEnterZone2')
  evt.preventDefault()
  if (dragContext.enteredZone2 || dragContext.pushedTempItem) {
    return
  }
  dragContext.enteredZone2 = true
  if (dragContext.fromZone == '1') {
    console.log('enter from zone1 to zone2')
    dragContext.pluginInstance = pluginInstanceFromType(dragContext.pluginType)
    dragContext.pushedTempItem = true
    if (dragContext.pluginInstance.tail || pluginChain.value.length == 0 || !pluginChain.value[pluginChain.value.length - 1].tail) {
      pluginChain.value.push(dragContext.pluginInstance)
    } else {
      pluginChain.value.splice(pluginChain.value.length - 1, 0, dragContext.pluginInstance)
    }
  }
}

const dragLeaveZone2 = (evt) => {
  console.log('dragLeaveZone2')
  evt.preventDefault()
  dragContext.enteredZone2 = false
  if (dragContext.pushedTempItem) {
    dragContext.pushedTempItem = false
    removeFormPluginChain(dragContext.pluginInstance.id)
    dragContext.pluginInstance = null
  }
}

const dragOverZone2 = (evt) => {
  // console.log('dragOverZone2')
  evt.preventDefault()
}

const pluginInstanceFromType = (pluginType) => {
  return {
    id: pluginType.id,
    name: pluginType.name,
    nameDisplay: pluginType.nameDisplay,
    version: pluginType.version,
    description: pluginType.description,
    tail: pluginType.tail,
    draggable: false,
    preventEvents: true,
    temp: true,
  }
}

const dragDropZone2 = (evt) => {
  console.log("dragDropZone2")
  console.log("to do", evt)
  if (dragContext.fromZone == '1') {
    dragContext.pluginType.used = true
    dragContext.pluginInstance.temp = false
  }
}

const removeFormPluginChain = (pId) => {
  for (var i = 0; i < pluginChain.value.length; i++) {
    if (pluginChain.value[i].id == pId) {
      pluginChain.value.splice(i, 1)
      setApiPluginUsed(pId, false)
      break
    }
  }
  if (pluginChain.value.length == 0 || !pluginChain.value[pluginChain.value.length - 1].tail) {
    for (var j = 0; i < apiPlugins.value.length; j++) {
      apiPlugins.value[j].draggable = true
    }
  }
}

</script>

<style scoped>
.api-create-container {
  padding-top: 1rem;
  width: 100%;
  height: calc(100vh - 85px);
}

.api-create-left {
  width: 280px;
  margin-left: 1rem;
  margin-right: 1rem;
  overflow-x: hidden;
  overflow-y: hidden;
  float: left;
  height: 100%;
}

.api-create-left:hover {
  overflow-y: auto;
}

.api-create-right {
  margin-left: 250px;
  height: 100%;
  overflow: auto;
}

.configuration-container {
  padding: 20px;
  height: calc(100vh - 420px);
  overflow: auto;
  border: 1px solid #ccc;
  background-color: #fdfdfd;
  box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.3);
  transform: translateZ(10px);
}
</style>