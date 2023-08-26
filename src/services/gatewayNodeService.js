import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const listGatewayNodes = async (envId) => {
  const params = { envId: envId }
  return await HttpClient.get(ApiPaths.gatewayNodes, { params: params })
}

const GatewayNodeService = {
  listGatewayNodes
}

export { GatewayNodeService }