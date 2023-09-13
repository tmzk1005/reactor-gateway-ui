<template>
  <div style="overflow-y: auto; height: calc(100vh - 350px);">
    <a-page-header style="border: 1px solid rgb(235, 237, 240); margin-top: 10px;" title="基本信息">

      <a-descriptions bordered :column="3">
        <a-descriptions-item label="名称">
          <span style="font-weight: 700;">
            {{ plugin.name }}
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="版本">{{ plugin.version }}</a-descriptions-item>
        <a-descriptions-item label="ID">{{ plugin.id }}</a-descriptions-item>
        <a-descriptions-item label="实现类名" :span="3">{{ plugin.fullClassName }}</a-descriptions-item>
        <a-descriptions-item label="安装类型" :span="3">
          <a-tag :color="computePluginInstallType(plugin).color">
            {{ computePluginInstallType(plugin).text }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="必须置尾" :span="3">
          <a-tag :color="plugin.tail ? 'green' : 'gray'">
            {{ plugin.tail ? '是' : '否' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="所属组织" :span="3" v-if="!plugin.builtin && plugin.organizationId != null">
          {{ plugin.organizationName }}
        </a-descriptions-item>
      </a-descriptions>

    </a-page-header>

    <a-page-header style="border: 1px solid rgb(235, 237, 240); margin-top: 20px" title="功能简介">
      <p>{{ plugin.description }}</p>
    </a-page-header>

    <a-page-header style="border: 1px solid rgb(235, 237, 240); margin-top: 20px;" title="配置 Json Schema">
      <div>
        <highlightjs language="json" :code="JSON.stringify(JSON.parse(plugin.jsonSchema), null, 4)" />
      </div>
    </a-page-header>

    <a-page-header style="border: 1px solid rgb(235, 237, 240); margin-top: 20px" title="文档">
      <div class="markdown-doc-container" v-if="plugin.mdDoc" v-html="markdownHtml"></div>
    </a-page-header>
  </div>
</template>

<script setup>
import { computePluginInstallType } from "@/utils/bizConstants"
import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import { computed } from 'vue'
import hljs from 'highlight.js'

const props = defineProps({
  plugin: Object
})

console.log(props.plugin)

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  })
)

const markdownHtml = computed(() => marked.parse(props.plugin.mdDoc))

</script>