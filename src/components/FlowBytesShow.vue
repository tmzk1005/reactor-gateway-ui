<template>
  <a-tooltip placement="topLeft" :title="value + ' 字节'">
    <div style="display: inline;">
      <span style="float: left">
        {{ data[0] }}
      </span>
      <span style="float: right;">
        {{ data[1] }}
      </span>
    </div>
  </a-tooltip>
</template>

<script setup>
import { byteCountDisplay } from "@/utils/formatter"

const props = defineProps({
  value: { type: Number },
})

const data = byteCountDisplay(props.value)
</script>