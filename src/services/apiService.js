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

const ApiService = {
  createApi, listApis, getApiById
}

export { ApiService }