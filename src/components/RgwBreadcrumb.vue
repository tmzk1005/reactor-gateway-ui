<template>
  <a-row type="flex" justify="center">
    <a-col :span="24">
      <a-breadcrumb>
        <a-breadcrumb-item v-for="link in links" href="#" @click="router.push(link.path)" :key="link.name">{{ link.name }}</a-breadcrumb-item>
        <a-breadcrumb-item>{{ title }}</a-breadcrumb-item>
      </a-breadcrumb>
    </a-col>
  </a-row>

  <a-divider />
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  links: Object,
  title: String
})

const router = useRouter()
</script>