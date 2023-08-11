import { HttpClient, NoAuto } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"
import { useSessionStore } from "@/stores/session"

const login = async (userInfo) => {
  return await HttpClient.post(ApiPaths.login, userInfo, NoAuto)
}

const logout = async () => {
  useSessionStore().clear()
}

const createUser = async (userDto) => {
  return await HttpClient.post(ApiPaths.user, userDto)
}

const listUsers = async (pageNum, pageSize) => {
  const params = { pageNum: pageNum, pageSize: pageSize }
  return await HttpClient.get(ApiPaths.user, { params: params })
}

const enableUser = async (userId) => {
  return await HttpClient.post(ApiPaths.userEnable(userId))
}

const disableUser = async (userId) => {
  return await HttpClient.post(ApiPaths.userDisable(userId))
}

const deleteUser = async (userId) => {
  return await HttpClient.post(ApiPaths.userDelete(userId))
}

const UserService = {
  login, logout, createUser, listUsers, enableUser, disableUser, deleteUser
}

export { UserService }