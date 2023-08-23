<template>
  <a-row style="padding: 60px 0 50px 0; margin: 0">
    <a-col :offset="3" :span="18" class="search-container">
      <a-input-search v-model:value="searchText" placeholder="搜索API" size="large" :loading="isSearching" enter-button
        @search="doSearch">
        <template #addonBefore>
          <a-select v-model:value="contextEnvId" style="min-width: 120px; text-align: left;">
            <a-select-option v-for="env in environmentList" :key="env.id" :value="env.id">
              {{ env.name }}
            </a-select-option>
          </a-select>
        </template>
      </a-input-search>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from 'vue'
import { EnvironmentService } from "@/services/environmentService"
import { ApiService } from "@/services/apiService"

const searchText = ref('')
const isSearching = ref(false)
const environmentList = ref([])
const contextEnvId = ref('')

const getEnvironments = () => {
  EnvironmentService.getEnvironments().then((data) => {
    environmentList.value = data
    contextEnvId.value = environmentList.value[0].id
  })
}

getEnvironments()

const doSearch = () => {
  ApiService.searchReleasedApi(contextEnvId.value, searchText.value, 1, 10).then((data) => {
    console.log(data)
  })
}

</script>

<style scoped>
:deep(.search-container .ant-input) {
  font-family: monospace;
}
</style>