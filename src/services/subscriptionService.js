import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const subscribe = async (appId, apiId) => {
  const params = { appId: appId, apiId: apiId }
  return await HttpClient.post(ApiPaths.subscriptionSub, null, { params: params })
}

const SubscriptionService = {
  subscribe
}

export { SubscriptionService }
