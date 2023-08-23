<template>
  <a-row style="padding: 60px 0 50px 0; margin: 0">
    <a-col :offset="3" :span="18">
      <a-input-search v-model:value="searchText" placeholder="搜索API" size="large" :loading="isSearching" enter-button
        @search="doSearch" />
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from 'vue'

const searchText = ref('')
const isSearching = ref(false)

const doSearch = () => {
}
</script>