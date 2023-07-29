import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { Role } from '@/utils/bizConstants'

const useSessionStore = defineStore('session', () => {

  const userInfo = reactive({
    id: window.localStorage.getItem("id"),
    username: window.localStorage.getItem("username"),
    nickname: window.localStorage.getItem("nickname"),
    role: window.localStorage.getItem("role"),
    organizationId: window.localStorage.getItem("organizationId"),
    jwtToken: window.localStorage.getItem("jwtToken"),
    jwtExpireSeconds: parseInt(window.localStorage.getItem("jwtExpireSeconds")),
    loginTime: parseInt(window.localStorage.getItem("loginTime"))
  })

  function setUser(newUserInfo) {
    userInfo.id = newUserInfo.id
    userInfo.username = newUserInfo.username
    userInfo.nickname = newUserInfo.nickname
    userInfo.role = newUserInfo.role
    userInfo.organizationId = newUserInfo.organizationId
    userInfo.jwtToken = newUserInfo.jwtToken
    userInfo.jwtExpireSeconds = newUserInfo.jwtExpireSeconds
    userInfo.loginTime = new Date().getTime() / 1000

    window.localStorage.setItem("id", userInfo.id)
    window.localStorage.setItem("username", userInfo.username)
    window.localStorage.setItem("nickname", userInfo.nickname)
    window.localStorage.setItem("role", userInfo.role)
    window.localStorage.setItem("organizationId", userInfo.organizationId)
    window.localStorage.setItem("jwtToken", userInfo.jwtToken)
    window.localStorage.setItem("jwtExpireSeconds", userInfo.jwtExpireSeconds.toString())
    window.localStorage.setItem("loginTime", userInfo.loginTime.toString())
  }

  function clear() {
    userInfo.id = null
    userInfo.username = null
    userInfo.nickname = "未登录"
    userInfo.role = null
    userInfo.organizationId = null
    userInfo.jwtToken = null
    userInfo.jwtExpireSeconds = 0
    userInfo.loginTime = 0

    window.localStorage.removeItem("id")
    window.localStorage.removeItem("username")
    window.localStorage.removeItem("nickname")
    window.localStorage.removeItem("role")
    window.localStorage.removeItem("organizationId")
    window.localStorage.removeItem("jwtToken")
    window.localStorage.removeItem("jwtExpireSeconds")
    window.localStorage.removeItem("loginTime")
  }

  const isAuthenticated = computed(() => userInfo.id != null && userInfo.id != undefined)

  const isSystemAdmin = computed(() => isAuthenticated.value && userInfo.role == Role.systemAdmin)

  const isNormalUser = computed(() => isAuthenticated.value && userInfo.role == Role.normalUser)

  const token = computed(() => userInfo.jwtToken)

  return { userInfo, token, setUser, clear, isAuthenticated, isSystemAdmin, isNormalUser }
})

export { useSessionStore }
