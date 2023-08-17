import { PATTERN_NORMAL_NAME_ZH, PATTERN_PHONE } from "./patternConstants"


const Role = {
  systemAdmin: 'SYSTEM_ADMIN',
  normalUser: 'NORMAL_USER',
  organizationAdmin: 'ORGANIZATION_ADMIN',
}

const RoleSelectOptions = [
  { label: "普通用户", value: "NORMAL_USER" },
  { label: "组织管理员", value: "ORGANIZATION_ADMIN" },
  { label: "系统管理员", value: "SYSTEM_ADMIN" },
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
  let m = method.toUpperCase()
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

const userBaseInfoFormCheckRule = {
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, message: "昵称至少需要包含2个字符", trigger: "blur" },
    { max: 32, message: "昵称长度不能超过32个字符", trigger: "blur" },
    {
      pattern: PATTERN_NORMAL_NAME_ZH,
      message: "昵称只能包含字母,数字,下划线,以及中文字符",
      trigger: "blur",
    },
  ],
  phone: [
    { required: false, message: "请输入电话", trigger: "blur" },
    { min: 7, message: "电话号码长度不能低于7个字符", trigger: "blur" },
    { max: 32, message: "电话号码长度不能超过24个字符", trigger: "blur" },
    {
      pattern: PATTERN_PHONE,
      message: "电话号码只能包含数字和短横线",
      trigger: "blur",
    },
  ],
  email: [
    { required: false, message: "请输入邮箱", trigger: "blur" },
    { max: 32, message: "邮箱长度不能超过56个字符", trigger: "blur" }
  ],
  address: [
    { required: false, message: "请输入地址", trigger: "blur" },
    { max: 256, message: "地址长度不能超过256个字符", trigger: "blur" }
  ],
}

export { Role, RoleSelectOptions, DefaultPaginationConf, colorForHttpMethod, userBaseInfoFormCheckRule }