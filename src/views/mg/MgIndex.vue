<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="padding: 0; position: fixed; zIndex: 99; width: 100%; height: 40px; line-height: 40px;">
      Header
    </a-layout-header>
    <a-layout style="margin: 40px 0 0 0; padding: 0">
      <a-layout-sider v-model:collapsed="collapsed" collapsible
        style="position: fixed; height: 100vh; overflow: auto; padding: 0; margin: 0">
        Sider
      </a-layout-sider>
      <a-layout-content :style="{ marginLeft: mainContentMarginLeft }">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed } from 'vue'

const collapsed = ref(false)
const mainContentMarginLeft = computed(() => collapsed.value ? "80px" : "200px")
</script>