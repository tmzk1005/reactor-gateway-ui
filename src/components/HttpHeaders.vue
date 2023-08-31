<template>
  <div v-if="hasHeaders">
    <pre class="headers-content">{{ text }}</pre>
  </div>
  <div v-else>
    <pre class="headers-content" style="color:chocolate">未审计头信息</pre>
  </div>
</template>

<script setup>
const props = defineProps({
  headers: { type: Object },
})

const hasHeaders = props.headers != null && props.headers != undefined

console.log(props.headers)

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
.headers-content {
  margin: 0;
}
</style>