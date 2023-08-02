import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const createEnvironment = async (dto) => {
  return await HttpClient.post(ApiPaths.environment, dto)
}

const getEnvironments = async () => {
  return await HttpClient.get(ApiPaths.environment)
}

const EnvironmentService = {
  createEnvironment, getEnvironments
}

export { EnvironmentService }