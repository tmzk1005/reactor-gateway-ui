import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const createOrganization = async (dto) => {
  return await HttpClient.post(ApiPaths.organization, dto)
}

const getOrganizations = async () => {
  return await HttpClient.get(ApiPaths.organization)
}

const OrganizationService = {
  createOrganization, getOrganizations
}

export { OrganizationService }