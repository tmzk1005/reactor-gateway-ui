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
              <a-tag :color="computePluginInstallType(record).color">
                {{ computePluginInstallType(record).text }}
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
        <a-modal width="80%" v-model:open="pluginDetailModalVisible" title="插件详情" :footer="null">
          <plugin-detail-display :plugin="pluginToShow" :key="pluginToShow.id" />
        </a-modal>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import PluginDetailDisplay from "@/components/api/PluginDetailDisplay.vue"
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { PluginService } from '@/services/pluginService'
import { computePluginInstallType }  from "@/utils/bizConstants"

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

const loadAllPlugins = () => {
  PluginService.getAllPlugins().then((data) => {
    pluginList.value = data
  })
}
loadAllPlugins()

// -----------------------------------

const pluginDetailModalVisible = ref(false)
const pluginToShow = ref({})

const showDetailOfOnePlugin = (record) => {
  Object.assign(pluginToShow.value, record)
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

</script>
