<template>
  <a-layout>

    <rgw-breadcrumb title="新建API" :links="[{ name: 'API', path: RoutePaths.mgApi }]" />

    <div class="api-create-container">
      <div class="api-create-left">

        <!-- zone 1 -->
        <api-plugin v-for="plugin in zone1Plugins" :data="plugin" :key="plugin.id" v-show="!plugin.used"
          :draggable="plugin.draggable && (!plugin.tail || !zone2HasTail)" @dragstart="dragFromZone1ToZone2Start(plugin)"
          @dragend="dragFromZone1ToZone2End($event)">
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
              <div class="configuration-container" @dragenter="zone2DragEnter($event)" @dragover="zone2DragOver($event)"
                @dragleave="zone2DragLevel($event)" @drop="zone2DragDrop()">

                <!-- zone 2 -->
                <api-plugin-instance v-for="plugin in zone2Plugins" :data="plugin" :key="plugin.id"
                  :style="{ border: plugin.temporary ? 'dashed' : '' }" :draggable="plugin.draggable && !plugin.tail"
                  @dragstart="dragFromZone2ToZone2Start(plugin)" @dragend="dragFromZone2ToZone2End($event)"
                  @dragenter="zone2PluginDragEnter($event, plugin)" @dragover="zone2PluginDragOver($event)"
                  @dragleave="zone2PluginDragLeave($event)" @drop="zone2PluginDragDrop($event)">
                  <template #extra>
                    <a-button type="link" style="font-size: 1.1rem;">
                      <template #icon>
                        <setting-outlined style="padding: 0; margin: 0;" />
                      </template>
                      配置
                    </a-button>
                    <a-button type="link" style="font-size: 1.1rem;" @click="removePluginInZone2(plugin)">
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
import { computed, reactive, ref } from 'vue'
import { PluginService } from '@/services/pluginService'

// -------------------- 拖拽逻辑:初始状态 --------------------
const zone1Plugins = ref([])

const loadAllPlugins = () => {
  PluginService.getAllPlugins().then((data) => {
    zone1Plugins.value = data
    for (var i = 0; i < zone1Plugins.value.length; i++) {
      zone1Plugins.value[i].used = false
      zone1Plugins.value[i].draggable = true
    }
  })
}
loadAllPlugins()

// 维持拖拽逻辑实时状态的上下文对象
const zone1 = 1
const zone2 = 2
const dragContext = {
  srcZone: null,
  draggingPlugin: null,
  zone1EnterZone2Count: 0,
}

const zone2Plugins = ref([])
const zone2HasTail = computed(() => zone2Plugins.value.length > 0 && zone2Plugins.value[zone2Plugins.value.length - 1].tail)

// -------------------- 拖拽逻辑:工具方法 --------------------

const createZone2PluginByZone1Plugin = (zone1Plugin) => {
  return {
    id: zone1Plugin.id,
    name: zone1Plugin.name,
    version: zone1Plugin.version,
    description: zone1Plugin.description,
    tail: zone1Plugin.tail,
    draggable: false,
    temporary: true,
  }
}

const getPluginIndexInZoneById = (zone, id) => {
  var arr
  if (zone == zone1) {
    arr = zone1Plugins.value
  } else if (zone == zone2) {
    arr = zone2Plugins.value
  } else {
    return -1
  }
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i].id == id) {
      return i
    }
  }
  return -1
}

const removeFromZone2PluginsById = (id) => {
  let index = getPluginIndexInZoneById(zone2, id)
  zone2Plugins.value.splice(index, 1)
}

const swapPositionInZone2 = (pId1, pId2) => {
  let index1 = getPluginIndexInZoneById(zone2, pId1)
  let index2 = getPluginIndexInZoneById(zone2, pId2)
  let tmp = zone2Plugins.value[index1]
  zone2Plugins.value[index1] = zone2Plugins.value[index2]
  zone2Plugins.value[index2] = tmp
}

// -------------------- 拖拽逻辑:从区域1拖到区域2 --------------------

const dragFromZone1ToZone2Start = (plugin) => {
  console.log("dragFromZone1ToZone2Start")
  dragContext.srcZone = zone1
  dragContext.draggingPlugin = plugin
}

const dragFromZone1ToZone2End = (event) => {
  console.log("dragFromZone1ToZone2End")
  event.preventDefault()
  dragContext.srcZone = null
  dragContext.draggingPlugin = null
  dragContext.zone1EnterZone2Count = 0
}

// -------------------- 拖拽逻辑:从区域2拖到区域2 --------------------

const dragFromZone2ToZone2Start = (plugin) => {
  console.log("dragFromZone2ToZone2Start")
  dragContext.srcZone = zone2
  dragContext.draggingPlugin = plugin
  dragContext.draggingPlugin.temporary = true
}

const dragFromZone2ToZone2End = (event) => {
  console.log("dragFromZone2ToZone2End")
  event.preventDefault()
  dragContext.srcZone = null
  dragContext.draggingPlugin.temporary = false
  dragContext.draggingPlugin = null
}

const pushInZone2Plugins = (plugin) => {
  let size = zone2Plugins.value.length
  if (size == 0 || !zone2Plugins.value[size - 1].tail) {
    zone2Plugins.value.push(plugin)
    return true
  } else if (!plugin.tail) {
    zone2Plugins.value.splice(size - 1, 0, plugin)
    return true
  }
  return false
}

// -------------------- 拖拽逻辑:区域2 drop 相关逻辑 --------------------

const zone2DragEnter = (event) => {
  console.log("zone2DragEnter")
  event.preventDefault()
  if (dragContext.srcZone == null) {
    return false
  }

  if (dragContext.srcZone == zone1) {
    dragContext.zone1EnterZone2Count += 1
    if (dragContext.zone1EnterZone2Count == 1) {
      // 是第一次真的进入zone2
      let zone2Plugin = createZone2PluginByZone1Plugin(dragContext.draggingPlugin)
      if (pushInZone2Plugins(zone2Plugin)) {
        dragContext.draggingPlugin.used = true
      }
    }
  }
}

const zone2DragOver = (event) => {
  // console.log("zone2DragOver")
  event.preventDefault()
}

const zone2DragLevel = (event) => {
  console.log("zone2DragLevel")
  event.preventDefault()
  if (dragContext.srcZone == null) {
    return false
  }

  if (dragContext.srcZone == zone1) {
    dragContext.zone1EnterZone2Count -= 1
    if (dragContext.zone1EnterZone2Count == 0) {
      // 真的离开了
      removeFromZone2PluginsById(dragContext.draggingPlugin.id)
      dragContext.draggingPlugin.used = false
    }
  }
}

const zone2DragDrop = () => {
  console.log("zone2DragDrop")
  if (dragContext.srcZone == null) {
    return false
  }
  if (dragContext.srcZone == zone1) {
    let index = getPluginIndexInZoneById(zone2, dragContext.draggingPlugin.id)
    zone2Plugins.value[index].temporary = false
    zone2Plugins.value[index].draggable = true
  }
}

// -------------------- 拖拽逻辑:区域2内的子元素的拖拽逻辑 --------------------

const noNeedHandle = (plugin) => {
  if (dragContext.srcZone == null) {
    return true
  }
  if (dragContext.draggingPlugin.tail || plugin.tail) {
    return true
  }
  if (dragContext.draggingPlugin.id == plugin.id) {
    return true
  }
  return false
}

const zone2PluginDragEnter = (event, plugin) => {
  console.log(`zone2PluginDragEnter on ${plugin.name}`)
  event.preventDefault()

  if (noNeedHandle(plugin)) {
    return false
  }

  swapPositionInZone2(dragContext.draggingPlugin.id, plugin.id)
}

const zone2PluginDragOver = (event) => {
  event.preventDefault()
}

const zone2PluginDragLeave = (event) => {
  event.preventDefault()
}

const zone2PluginDragDrop = (event) => {
  event.preventDefault()
}

// -------------------- 区域2按钮事件 --------------------

const removePluginInZone2 = (plugin) => {
  let index2 = getPluginIndexInZoneById(zone2, plugin.id)
  zone2Plugins.value.splice(index2, 1)

  let index1 = getPluginIndexInZoneById(zone1, plugin.id)
  zone1Plugins.value[index1].used = false
}


// -------------------- 提交新建API请求 --------------------
const apiDto = reactive({
  name: "",
  path: "",
  methods: [],
  tags: [],
  description: "",
})


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