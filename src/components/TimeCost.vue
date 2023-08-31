<template>
  <a-tooltip placement="topLeft" :title="value + ' 毫秒'">
    <div style="display: inline;">
      <span :style="{ float: 'left', color: color }">
        {{ data[0] }}
      </span>
      <span style="float: right;">{{ data[1] }}</span>
    </div>
  </a-tooltip>
</template>

<script setup>
import { colorForRequestTimeMillisCost, timeMillisDisplay } from "@/utils/formatter"

const props = defineProps({
  value: { type: Number },
})

const color = colorForRequestTimeMillisCost(props.value)
const data = timeMillisDisplay(props.value)

</script>