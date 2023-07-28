import { HttpClient, NoAuto } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const login = async (userInfo) => {
  return await HttpClient.post(ApiPaths.login, userInfo, NoAuto)
}

const UserService = {
  login,
}

export { UserService }