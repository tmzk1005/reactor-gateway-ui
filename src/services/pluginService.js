import { HttpClient } from "@/utils/http"
import { ApiPaths } from "@/utils/pathConstants"

const getAllPlugins = async () => {
  return await HttpClient.get(ApiPaths.plugin)
}

const PluginService = { getAllPlugins }

export { PluginService }