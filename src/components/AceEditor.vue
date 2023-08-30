<template>
  <div ref="editorRef" class="ace-editor"></div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-github'
import 'ace-builds/src-min-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/mode-markdown'
import workerJsonUrl from 'ace-builds/src-min-noconflict/worker-json?url'

const props = defineProps({
  language: { type: String, default: "json" },
  minLines: { type: Number, default: 30 },
  maxLines: { type: Number, default: 30 },
})

const editorRef = ref()
const editor = ref()

onMounted(() => {
  if (props.language == 'json') {
    ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl)
  }
  editor.value = ace.edit(editorRef.value, {
    maxLines: props.maxLines,
    minLines: props.minLines,
    tabSize: 4,
    fontSize: 18,
    theme: 'ace/theme/github',
    mode: `ace/mode/${props.language}`,
  })
})

const clear = () => {
  setContent("")
}

const setContent = (content) => {
  editor.value.setValue(content)
  editor.value.clearSelection()
}

const getContent = () => {
  return editor.value.getValue()
}

defineExpose({ clear, getContent, setContent })
</script>

<style scoped>
.ace-editor {
  width: 100%;
  line-height: 1.5;
  font-family: monospace;
  white-space: pre;
}
</style>
