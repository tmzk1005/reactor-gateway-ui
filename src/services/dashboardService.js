import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const getApisCount = async (envId, orgId) => {
  let params = { envId: envId, orgId: orgId }
  return await HttpClient.get(ApiPaths.dashboardApisCount, { params: params })
}

const getApiCallsCount = async (envId, orgId, apiId) => {
  let params = { envId: envId, orgId: orgId, apiId: apiId }
  return await HttpClient.get(ApiPaths.dashboardApiCallsCount, { params: params })
}

const getApiCallsCountTrend = async (envId, orgId, apiId, timeRangeType) => {
  let params = { envId: envId, orgId: orgId, apiId: apiId, timeRangeType: timeRangeType }
  return await HttpClient.get(ApiPaths.dasgboardApiCallsCountTrend, { params: params })
}

const DashboardService = {
  getApisCount, getApiCallsCount, getApiCallsCountTrend
}

export { DashboardService }