<template>
  <div style="padding: 12px;">
    <p style="padding-left: 1rem; padding: 0;">{{ label }}</p>
    <p style="font-size: 2.5rem; font-weight: bolder; line-height: 0.3; padding: 0; margin-bottom: 12px;">{{ value != null ? value : "加载失败" }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: Number
})
</script>