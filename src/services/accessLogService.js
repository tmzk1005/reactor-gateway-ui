import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const searchAccessLogs = async (envId, pageNum, pageSize, params) => {
  if (!params) {
    params = {}
  }
  params['envId'] = envId
  params['pageNum'] = pageNum
  params['pageSize'] = pageSize
  return await HttpClient.get(ApiPaths.accessLog, { params: params })
}

const AccessLogService = {
  searchAccessLogs
}

export { AccessLogService }