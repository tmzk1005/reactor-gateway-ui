<template>
  <a-layout>
    <rgw-breadcrumb title="插件" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="插件" style="font-family: monospace;">
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-table rowKey="id" :pagination="false" :footer="null" :dataSource="pluginList" :columns="pluginFields"
          :scroll="pluginTableScroll">

          <template #headerCell="{ title, column }">
            <template v-if="column.dataIndex === 'tail'">
              <a-tooltip placement="topLeft" arrow-point-at-center title="API的处理由一条配置的插件链来完成，插件链有且仅有一个必须置尾的插件放在插件链的尾部。">
                <a-space>
                  <span>{{ title }}</span>
                  <question-circle-outlined />
                </a-space>
              </a-tooltip>
            </template>
          </template>

          <template #bodyCell="{ column, record }">

            <template v-if="column.dataIndex === 'name'">
              <a-button type="link" @click="showDetailOfOnePlugin(record)">{{ record.name }}</a-button>
            </template>

            <template v-if="column.dataIndex === 'builtin'">
              <a-tag :color="computeInstallType(record).color">
                {{ computeInstallType(record).text }}
              </a-tag>
            </template>

            <template v-if="column.dataIndex === 'tail'">
              <a-tag :color="record.tail ? 'green' : 'gray'">
                {{ record.tail ? '是' : '否' }}
              </a-tag>
            </template>

          </template>
        </a-table>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-modal class="plugin-detail-modal" width="80%" v-model:open="pluginDetailModalVisible" title="插件详情"
          :footer="null">
          <div style="overflow-y: auto; height: calc(100vh - 350px);" class="plugin-detail-container">
            <a-page-header style="border: 1px solid rgb(235, 237, 240); margin-top: 10px;" title="基本信息">

              <a-descriptions bordered :column="3">
                <a-descriptions-item label="名称"><span style="font-weight: 700;">{{ pluginToShow.name
                }}</span></a-descriptions-item>
                <a-descriptions-item label="版本">{{ pluginToShow.version }}</a-descriptions-item>
                <a-descriptions-item label="ID">{{ pluginToShow.id }}</a-descriptions-item>
                <a-descriptions-item label="实现类名" :span="3">{{ pluginToShow.fullClassName }}</a-descriptions-item>
                <a-descriptions-item label="安装类型" :span="3">
                  <a-tag :color="computeInstallType(pluginToShow).color">
                    {{ computeInstallType(pluginToShow).text }}
                  </a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="必须置尾" :span="3">
                  <a-tag :color="pluginToShow.tail ? 'green' : 'gray'">
                    {{ pluginToShow.tail ? '是' : '否' }}
                  </a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="所属组织" :span="3"
                  v-if="!pluginToShow.builtin && pluginToShow.organizationId != null">
                  {{ pluginToShow.organizationName }}
                </a-descriptions-item>
              </a-descriptions>

            </a-page-header>

            <a-page-header style="border: 1px solid rgb(235, 237, 240); margin-top: 20px" title="功能简介">
              <p>{{ pluginToShow.description }}</p>
            </a-page-header>

            <a-page-header style="border: 1px solid rgb(235, 237, 240); margin-top: 20px;" title="配置 Json Schema">
              <div>
                <highlightjs language="json" :code="JSON.stringify(JSON.parse(pluginToShow.jsonSchema), null, 4)" />
              </div>
            </a-page-header>

            <a-page-header style="border: 1px solid rgb(235, 237, 240); margin-top: 20px" title="文档">
              <p>
                {{ pluginToShow.mdDoc }}
              </p>
            </a-page-header>
          </div>
        </a-modal>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { PluginService } from '@/services/pluginService'

// -----------------------------------

const pluginFields = [
  {
    title: "插件名称",
    dataIndex: "name",
    width: '200px',
    minWidth: '200px'
  },
  {
    title: "插件版本",
    dataIndex: "version",
    width: '120px',
    minWidth: '120px'
  },
  {
    title: "安装类型",
    dataIndex: "builtin",
    width: '120px',
    minWidth: '120px'
  },
  {
    title: "必须置尾",
    dataIndex: "tail",
    width: '120px',
    minWidth: '120px'
  },
  {
    title: "功能简介",
    dataIndex: "description",
    ellipsis: true,
  }
]

const pluginTableScroll = reactive({
  y: window.innerHeight - 250
})

const pluginList = ref([])

const computeInstallType = (item) => {
  let result = {
    text: "",
    color: ""
  }
  if (item.builtin) {
    result.text = "内置"
    result.color = "green"
  } else if (item.organizationId == null || item.organizationId == undefined || item.organizationId == "") {
    result.text = "自定义-共享"
    result.color = "blue"
  } else {
    result.text = "自定义-组织私有"
    result.color = "orange"
  }
  return result
}

const loadAllPlugins = () => {
  PluginService.getAllPlugins().then((data) => {
    pluginList.value = data
  })
}
loadAllPlugins()

// -----------------------------------

const pluginDetailModalVisible = ref(false)
const pluginToShow = reactive({
  id: "",
  name: "",
  fullClassName: "",
  version: "",
  jsonSchema: "",
  organizationId: "",
  organizationName: "",
  builtin: true,
  tail: false,
  description: "",
  mdDoc: "",
})

const showDetailOfOnePlugin = (record) => {
  Object.assign(pluginToShow, record)
  pluginDetailModalVisible.value = true
}

// -----------------------------------

const windowResizeListener = () => {
  pluginTableScroll.y = window.innerHeight - 250
}

onMounted(() => {
  window.addEventListener('resize', windowResizeListener)
})

onUnmounted(() => {
  window.removeEventListener('resize', windowResizeListener)
})

// -----------------------------------

</script>
