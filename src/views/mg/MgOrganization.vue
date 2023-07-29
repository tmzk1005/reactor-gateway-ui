<template>
  <a-layout>
    <rgw-breadcrumb title="组织管理" />

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-page-header title="组织管理">
          <template #extra>
            <a-button type="primary" @click="() => modalVisible = true">新建组织</a-button>
          </template>
        </a-page-header>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-table :dataSource="organizationList" :columns="organizationFields" rowKey="id" size="small"
          :pagination="false">
        </a-table>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col :span="24">
        <a-modal width="50%" v-model:open="modalVisible" title="新建组织">
          <a-form ref="newOrganizationFormRef" :model="newOrganization" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 24 }">
            <a-form-item label="组织名称" name="name">
              <a-input v-model:value="newOrganization.name" placeholder="请输入组织名称" />
            </a-form-item>
          </a-form>
          <template #footer>
            <a-button key="submit" type="primary" @click="confirmAdd">确认</a-button>
          </template>
        </a-modal>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
import RgwBreadcrumb from "@/components/RgwBreadcrumb.vue"
import { reactive, ref } from "vue"
import { notification } from "ant-design-vue"
import { OrganizationService } from "@/services/organizationService"

const modalVisible = ref(false)
const organizationList = ref([])
const newOrganizationFormRef = ref()

const organizationFields = [
  { title: "组织ID", dataIndex: "id", width: '120px', minWidth: '120px' },
  { title: "组织名称", dataIndex: "name" },
  { title: "创建时间", dataIndex: "createdDate" }
]

const newOrganization = reactive({
  name: null,
})

const getOrganizations = () => {
  OrganizationService.getOrganizations().then((data) => {
    organizationList.value = data
  })
}

const confirmAdd = () => {
  newOrganizationFormRef.value.validate().then(() => {
    let dto = { name: newOrganization.name }
    OrganizationService.createOrganization(dto).then(() => {
      notification.success({ message: "新建组织成功" })
      modalVisible.value = false
      newOrganization.name = null
      getOrganizations()
    })
  })
}

getOrganizations()
</script>