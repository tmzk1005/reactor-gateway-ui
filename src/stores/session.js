import { reactive } from 'vue'
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
    userInfo.value.id = newUserInfo.id
    userInfo.value.username = newUserInfo.username
    userInfo.value.nickname = newUserInfo.nickname
    userInfo.value.role = newUserInfo.role
    userInfo.value.organizationId = newUserInfo.organizationId
  }

  function clear() {
    userInfo.value.id = null
    userInfo.value.username = null
    userInfo.value.nickname = "未登录"
    userInfo.value.role = null
    userInfo.value.organizationId = null
  }

  return { userInfo, setUser, clear }
})

export { useSessionStore }
