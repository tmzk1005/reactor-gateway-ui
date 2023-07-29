<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="padding: 0; position: fixed; zIndex: 99; width: 100%; height: 40px; line-height: 40px;">
      <mg-top-bar></mg-top-bar>
    </a-layout-header>
    <a-layout style="margin: 40px 0 0 0; padding: 0">
      <a-layout-sider v-model:collapsed="collapsed" collapsible
        style="position: fixed; height: 100vh; overflow: auto; padding: 0; margin: 0">
        <mg-menu></mg-menu>
      </a-layout-sider>
      <a-layout-content :style="{ marginLeft: mainContentMarginLeft }">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import MgTopBar from "@/components/topBar/MgTopBar.vue"
import MgMenu from "@/components/menu/MgMenu.vue"

import { ref, computed } from 'vue'

const collapsed = ref(false)
const mainContentMarginLeft = computed(() => collapsed.value ? "80px" : "200px")
</script>