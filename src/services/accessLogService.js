import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const searchAccessLogs = async (envId, pageNum, pageSize) => {
  const params = { envId: envId, pageNum: pageNum, pageSize: pageSize }
  return await HttpClient.get(ApiPaths.accessLog, { params: params })
}

const AccessLogService = {
  searchAccessLogs
}

export { AccessLogService }