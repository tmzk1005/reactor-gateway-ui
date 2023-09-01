<template>
  <div v-if="hasHeaders">
    <highlightjs autodetect :code="text" class="http-headers-content" />
  </div>
  <div v-else>
    <pre class="http-headers-conten" style="color:chocolate">未审计头信息</pre>
  </div>
</template>

<script setup>
const props = defineProps({
  headers: { type: Object },
})

const hasHeaders = props.headers != null && props.headers != undefined

const convertHeadersToText = () => {
  let arr = []
  if (!props.headers) {
    return ""
  }
  for (var headerName in props.headers) {
    for (var i = 0; i < props.headers[headerName].length; ++i) {
      arr.push(headerName + ": " + props.headers[headerName][i])
    }
  }
  return arr.join("\n")
}

const text = convertHeadersToText()

</script>

<style scoped>
.http-headers-content {
  width: 100%;
  max-height: 500px;
  overflow: auto;
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

pre {
  tab-size: 4;
}
</style>