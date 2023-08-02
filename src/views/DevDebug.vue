<template>
  <a-layout style="min-height: 100vh;">
    <a-layout-content style="margin: 60px 10% 0 10%;">
      <a-form ref="formRef" :model="httpReq" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">

        <a-form-item label="请求方法" name="method">
          <a-radio-group button-style="solid" v-model:value="httpReq.method">
            <a-radio-button value="GET">GET</a-radio-button>
            <a-radio-button value="POST">POST</a-radio-button>
            <a-radio-button value="DELETE">DELETE</a-radio-button>
            <a-radio-button value="PATCH">PATCH</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="请求路径" name="path">
          <a-input v-model:value="httpReq.path" />
        </a-form-item>

        <a-form-item label="url参数" name="urlParams">
          <a-textarea v-model:value="httpReq.urlParams" :autosize="{ minRows: 2, maxRows: 5 }"
            placeHolder="按json格式配置键值对" />
        </a-form-item>

        <a-form-item label="Content-Type" name="contentType">
          <a-select v-model:value="httpReq.contentType" style="width: 400px">
            <a-select-option value="">无</a-select-option>
            <a-select-option value="application/json">application/json</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="请求体" name="reqBody">
          <a-textarea v-model:value="httpReq.reqBody" :autosize="{ minRows: 5, maxRows: 20 }" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 12 }">
          <a-button key="submit" type="primary" @click="sendRequest">提交请求</a-button>
        </a-form-item>

        <a-divider />

        <a-form-item label="响应" name="resp" style="padding-top: 30px;" v-if="httpReq.respBody != ''">
          <a-textarea v-model:value="httpReq.respBody" readonly :autosize="{ minRows: 5, maxRows: 30 }" />
        </a-form-item>

      </a-form>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { HttpClient } from '@/utils/http'

const formRef = ref()
const httpReq = reactive({
  method: "GET",
  contentType: "application/json",
  path: "/",
  urlParams: "",
  reqBody: "",
  respBody: "",
})

const sendRequest = () => {
  let req = {
    method: httpReq.method,
    url: httpReq.path,
    autoHandle: false,
  }
  if (httpReq.contentType != '') {
    req.headers = { "Content-Type": httpReq.contentType }
  }
  if (httpReq.reqBody != '') {
    req.data = httpReq.reqBody
  }
  if (httpReq.urlParams != '') {
    req.params = JSON.parse(httpReq.urlParams)
  }
  HttpClient(req)
    .then((data) => httpReq.respBody = JSON.stringify(data))
}
</script>

