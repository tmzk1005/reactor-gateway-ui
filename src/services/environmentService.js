import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const createEnvironment = async (dto) => {
  return await HttpClient.post(ApiPaths.environment, dto)
}

const getEnvironments = async () => {
  return await HttpClient.get(ApiPaths.environment)
}

const getVarsInEnv = async (envId, orgId) => {
  const params = { envId: envId, orgId: orgId }
  return await HttpClient.get(ApiPaths.environmentBinding, { params: params })
}

const setVarsInEnv = async (envId, orgId, vars) => {
  const params = { envId: envId, orgId: orgId }
  return await HttpClient.post(ApiPaths.environmentBinding, vars, { params: params })
}

const EnvironmentService = {
  createEnvironment, getEnvironments, getVarsInEnv, setVarsInEnv
}

export { EnvironmentService }