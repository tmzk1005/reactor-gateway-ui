import { HttpClient, NoAuto } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"
import { useSessionStore } from "@/stores/session"

const login = async (userInfo) => {
  return await HttpClient.post(ApiPaths.login, userInfo, NoAuto)
}

const logout = async () => {
  useSessionStore().clear()
}

const UserService = {
  login, logout
}

export { UserService }