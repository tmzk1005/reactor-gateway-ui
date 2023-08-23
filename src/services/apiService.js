import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const createApi = async (apiDto) => {
  return await HttpClient.post(ApiPaths.api, apiDto)
}

const listApis = async (pageNum, pageSize) => {
  const params = { pageNum: pageNum, pageSize: pageSize }
  return await HttpClient.get(ApiPaths.api, { params: params })
}

const getApiById = async (apiId) => {
  return await HttpClient.get(ApiPaths.apiById(apiId))
}

const publishApi = async (apiId, envId) => {
  const params = { envId: envId }
  return await HttpClient.post(ApiPaths.apiPublish(apiId), null, { params: params })
}

const unpublishApi = async (apiId, envId) => {
  const params = { envId: envId }
  return await HttpClient.post(ApiPaths.apiUnpublish(apiId), null, { params: params })
}

const searchReleasedApi = async (envId, searchText, pageNum, pageSize) => {
  const params = { pageNum: pageNum, pageSize: pageSize, searchText: searchText }
  return await HttpClient.get(ApiPaths.apiReleased(envId), { params: params })
}

const ApiService = {
  createApi, listApis, getApiById, publishApi, unpublishApi, searchReleasedApi
}

export { ApiService }