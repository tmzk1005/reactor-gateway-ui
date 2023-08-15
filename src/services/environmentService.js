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
  let dto = {keyValues: []}
  for (var i = 0; i < vars.length; i++) {
    if (vars[i].deleted) {
      continue
    }
    dto.keyValues.push({
      key: vars[i].varName,
      value: vars[i].varValue
    })
  }
  return await HttpClient.post(ApiPaths.environmentBinding, dto, { params: params })
}

const EnvironmentService = {
  createEnvironment, getEnvironments, getVarsInEnv, setVarsInEnv
}

export { EnvironmentService }