const RoutePaths = {
    mgIndex: "/mg",
    mgLogin: "/mg/login",
    mgDashboard: "/mg/dashboard",
    mgOrganization: "/mg/organization",
    mgEnvironment: "/mg/environment",
    mgUser: "/mg/user",
    mgApi: "/mg/api",
    mgAccessLog: "/mg/access-log",
    mgApiSubscription: "/mg/api-subscription",
    mgMyInfo: "/mg/my-info",

    mkIndex: "/mk",
    mkLogin: "/mk/login",
    mkMyInfo: "/mk/my-info",
}

const ApiPaths = {
    context: "/rgw/api/",
    login: "/user/_login",
    organization: "/organization",
    environment: "/environment",
    user: "/user",
    userSelfDetail: "/user/me",
    userPasswordUpdate: "/user/password/_update",
    userEnable: (userId) => `/user/_enable/${userId}`,
    userDisable: (userId) => `/user/_disable/${userId}`,
    userDelete: (userId) => `/user/_delete/${userId}`,
    api: "/api",
}

export { RoutePaths, ApiPaths }
