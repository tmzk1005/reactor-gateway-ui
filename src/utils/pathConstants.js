const RoutePaths = {
    mgIndex: "/mg",
    mgLogin: "/mg/login",
    mgDashboard: "/mg/dashboard",
    mgOrganization: "/mg/organization",
    mgEnvironment: "/mg/environment",
    mgUser: "/mg/user",
    mgApi: "/mg/api",
    mgApiCreate: "/mg/api/create",
    mgApiUpdate: "/mg/api/update/:apiId",
    mgApiDetail: "/mg/api/detail/:apiId",
    mgAccessLog: "/mg/access-log",
    mgApiSubscription: "/mg/api-subscription",
    mgMyInfo: "/mg/my-info",
    mgPlugin: "/mg/plugin",

    mgGateway: "/mg/gateway",

    mkIndex: "/mk",
    mkApi: "/mk/api",
    mkUserApp: "/mk/app",
    mkUserApply: "/mk/apply",
    mkAccessLog: "/mk/access-log",
    mkLogin: "/mk/login",
    mkMyInfo: "/mk/my-info",
}

const ApiPaths = {
    context: "/rgw/api/",
    login: "/user/_login",
    organization: "/organization",
    environment: "/environment",
    environmentBinding: "/environment/binding",
    user: "/user",
    userSelfDetail: "/user/me",
    userPasswordUpdate: "/user/password/_update",
    userEnable: (userId) => `/user/_enable/${userId}`,
    userDisable: (userId) => `/user/_disable/${userId}`,
    userDelete: (userId) => `/user/_delete/${userId}`,

    api: "/api",
    apiById: (apiId) => `/api/${apiId}`,
    apiPublish: (apiId) => `/api/_publish/${apiId}`,
    apiUnpublish: (apiId) => `/api/_unpublish/${apiId}`,
    apiReleased: (envId) => `/api/released/${envId}`,

    plugin: "/plugin",

    app: "/app",

    subscription: "/subscription",
    subscriptionSub: "/subscription/_subscribe",
    subscriptionApprove: (subId) => `/subscription/${subId}/_approve`,
    subscriptionReject: (subId) => `/subscription/${subId}/_reject`,

    gatewayNodes: "/gateway/nodes",

    accessLog: "/access-log",
}

const RouteNames = {
    mgApiDetail: 'mgApiDetail',
    mgApiUpdate: 'mgApiUpdate',
}

export { RoutePaths, ApiPaths, RouteNames }
