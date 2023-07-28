import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

const useSessionStore = defineStore('session', () => {
  const userInfo = reactive({
    id: null,
    username: "alice",
    nickname: "未登录",
    role: null,
    organizationId: null,
  })

  function setUser(newUserInfo) {
    userInfo.id = newUserInfo.id
    userInfo.username = newUserInfo.username
    userInfo.nickname = newUserInfo.nickname
    userInfo.role = newUserInfo.role
    userInfo.organizationId = newUserInfo.organizationId
  }

  function clear() {
    userInfo.id = null
    userInfo.username = null
    userInfo.nickname = "未登录"
    userInfo.role = null
    userInfo.organizationId = null
  }

  const isAuthenticated = computed(() => userInfo.id != null && userInfo.id != undefined)

  return { userInfo, setUser, clear, isAuthenticated }
})

export { useSessionStore }
