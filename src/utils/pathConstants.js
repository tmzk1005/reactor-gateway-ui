const RoutePaths = {
    mgIndex: "/mg",
    mgLogin: "/mg/login",
    mgDashboard: "/mg/dashboard",
    mgOrganization: "/mg/organization",
    mgEnvironment: "/mg/environment",
    mgUser: "/mg/user",
    mgApi: "/mg/api",
    mgAccessLog: "/mg/access-log",
    mgApiApply: "/mg/api-apply",

    mkIndex: "/mk",
    mkLogin: "/mk/login"
}

const ApiPaths = {
    context: "/rgw/api/",
    login: "/user/_login",
    organization: "/organization",
    environment: "/environment",
    user: "/user",
    userEnable: (userId) => `/user/_enable/${userId}`,
    userDisable: (userId) => `/user/_disable/${userId}`,
    userDelete: (userId) => `/user/_delete/${userId}`,
    api: "/api",
}

export { RoutePaths, ApiPaths }
