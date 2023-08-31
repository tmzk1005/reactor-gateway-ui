<template>
  <a-tooltip placement="topLeft" color="blue" :title="value.toLocaleString() + ' 毫秒'">
    <div class="container"
      :style="{ background: `linear-gradient(to right, ${color}, ${color} ${percentage}%, white ${percentage}%, white)` }">
      <span class="left">
        {{ data[0] }}
      </span>
      <span class="right">{{ data[1] }}</span>
    </div>
  </a-tooltip>
</template>

<script setup>
import { colorForRequestTimeMillisCost, timeMillisDisplay } from "@/utils/formatter"

const props = defineProps({
  value: { type: Number },
})

const data = timeMillisDisplay(props.value)

const colorAndPercentage = colorForRequestTimeMillisCost(props.value)
const color = colorAndPercentage[0]
const percentage = colorAndPercentage[1]

</script>

<style scoped>
.container {
  width: 100%;
  overflow: hidden;
}

.left {
  float: left;
  background: transparent;
  width: calc(100% - 40px);
}

.right {
  float: right;
  background: transparent;
}
</style>