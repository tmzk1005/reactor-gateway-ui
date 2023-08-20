<template>
  <div ref="editorRef" class="json-editor"></div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-github'
import 'ace-builds/src-min-noconflict/mode-json'
import workerJsonUrl from 'ace-builds/src-min-noconflict/worker-json?url'

const editorRef = ref()
const editor = ref()

onMounted(() => {
  ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl)
  editor.value = ace.edit(editorRef.value, {
    maxLines: 30,
    minLines: 30,
    tabSize: 4,
    fontSize: 18,
    theme: 'ace/theme/github',
    mode: 'ace/mode/json',
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
.json-editor {
  width: 100%;
  line-height: 1.5;
  font-family: monospace;
  white-space: pre;
}
</style>
