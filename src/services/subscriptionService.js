import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const subscribe = async (appId, apiId) => {
  const params = { appId: appId, apiId: apiId }
  return await HttpClient.post(ApiPaths.subscriptionSub, null, { params: params })
}

const _doListHistory = async (pageNum, pageSize, asSubscriber) => {
  const params = { pageNum: pageNum, pageSize: pageSize, asSubscriber: asSubscriber }
  return await HttpClient.get(ApiPaths.subscription, { params: params })
}

const listHistoryAsSubscriber = async (pageNum, pageSize) => {
  return _doListHistory(pageNum, pageSize, true)
}

const listHistory = async (pageNum, pageSize) => {
  return _doListHistory(pageNum, pageSize, false)
}

const SubscriptionService = {
  subscribe, listHistoryAsSubscriber, listHistory
}

export { SubscriptionService }
