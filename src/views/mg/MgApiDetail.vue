<template>
  <a-layout>
    <rgw-breadcrumb title="API详情" :links="[{ name: 'API', path: RoutePaths.mgApi }]" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header style="border: 1px solid rgb(235, 237, 240); margin-top: 10px;" title="API基本信息">

          <a-descriptions bordered :column="3">
            <a-descriptions-item label="名称"><span style="font-weight: 700;">
                {{ api.name }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="ID"><span style="font-weight: 700;">
                {{ api.id }}</span>
            </a-descriptions-item>
          </a-descriptions>

        </a-page-header>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import { ref } from 'vue'
import { RoutePaths } from '@/utils/pathConstants'
import { ApiService } from "@/services/apiService"

const props = defineProps({
  apiId: String
})

const api = ref({})

const getApi = (id) => {
  ApiService.getApiById(id).then((data) => {
    api.value = data
  })
}

getApi(props.apiId)
</script>