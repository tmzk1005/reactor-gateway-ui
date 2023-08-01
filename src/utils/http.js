import axios from "axios"
import qs from "qs"
import router from "@/router"
import { notification } from "ant-design-vue"
import { ApiPaths, RoutePaths } from "@/utils/pathConstants"
import { useSessionStore } from "@/stores/session"

const sessionStore = useSessionStore()

const configRequest = (config) => {
  if (config.data instanceof FormData) {
    Object.assign(config.headers, config.data.getHeaders())
  }
  const jwtToken = sessionStore.token
  if (jwtToken) {
    config.headers['Authorization'] = jwtToken
  }
  return config
}

const handleOk = (resp) => {
  if (!resp.config.autoHandle) {
    return resp.data
  }

  const respData = resp.data
  const code = respData.code

  if (code == undefined) {
    return respData
  } else if (code == 0) {
    return respData.data
  } else {
    const message = respData.message
    notification.error({
      message: message,
      duration: 2,
    })
    return Promise.reject(message)
  }
}

const handleError = (error) => {
  let notificationMessage = "请求错误"
  let notificationDescription = "服务器内部错误，请联系管理员！"
  if (error.response.data && Object.hasOwn(error.response.data, 'message')) {
    notificationDescription = error.response.data.message
  }

  if (error.response.data && Object.hasOwn(error.response.data, 'code') && error.response.data.code == 401) {
    sessionStore.clear()
    setTimeout(() => {
      router.push(RoutePaths.mgLogin)
    }, 100)
    notification.warning({
      message: '会话已过期',
      duration: 1,
      description: '请重新登录'
    })
  } else {
    notification.error({
      message: notificationMessage,
      duration: 2,
      description: notificationDescription
    })
  }
  return Promise.reject(error)
}

const HttpClient = axios.create({
  baseURL: ApiPaths.context,
  headers: {
    "Content-Type": "application/json;charset=UTF-8;",
  },
  autoHandle: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
})

HttpClient.interceptors.request.use(configRequest, (error) => Promise.reject(error))
HttpClient.interceptors.response.use((resp) => handleOk(resp), (error) => handleError(error))

const NoAuto = { autoHandle: false }

export { HttpClient, NoAuto }