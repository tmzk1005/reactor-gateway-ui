const Role = {
  systemAdmin: 'SYSTEM_ADMIN',
  securityAdmin: 'SECURITY_ADMIN',
  auditAdmin: 'AUDIT_ADMIN',
  normalUser: 'NORMAL_USER',
  organizationAdmin: 'ORGANIZATION_ADMIN',
}

const RoleSelectOptions = [
  { label: "普通用户", value: "NORMAL_USER" },
  { label: "系统管理员", value: "SYSTEM_ADMIN" },
  { label: "组织管理员", value: "ORGANIZATION_ADMIN" },
  { label: "审计管理员", value: "AUDIT_ADMIN" },
  { label: "安全管理员", value: "SECURITY_ADMIN" }
]

const DefaultPaginationConf = {
  position: "bottom",
  showQuickJumper: true,
  showSizeChanger: true,
  pageSizeOptions: ["2", "10", "15", "20", "50", "100"],
  total: 0,
  pageSize: 15,
  current: 1,
  showTotal: (total) => "共" + total + "条",
}

const colorForHttpMethod = (method) => {
  let   m = method.toUpperCase()
  if ("GET" == m) {
    return 'green'
  } else if ("POST" == m) {
    return 'blue'
  } else if ("PATCH" == m) {
    return 'orange'
  } else if ("DELETE" == m) {
    return 'red'
  } else {
    return "purple"
  }
}

export { Role, RoleSelectOptions, DefaultPaginationConf, colorForHttpMethod }