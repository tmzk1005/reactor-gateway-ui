import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const createApp = async (appDto) => {
  return await HttpClient.post(ApiPaths.app, appDto)
}

const listApps = async (pageNum, pageSize) => {
  const params = { pageNum: pageNum, pageSize: pageSize }
  return await HttpClient.get(ApiPaths.app, { params: params })
}

const AppService = {
  createApp, listApps
}

export { AppService }