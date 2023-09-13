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

const createStatusCodeTreeData = () => {
  let codes = [
    [100, 101, 102],
    [200, 201, 202, 203, 204, 205, 206, 207],
    [300, 301, 302, 303, 304, 305, 307, 308],
    [
      400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410,
      411, 412, 413, 414, 415, 416, 417,
      421, 422, 423, 424, 425, 426, 428, 429, 431
    ],
    [500, 501, 502, 503, 504, 505, 506, 507, 510, 511]
  ]
  let data = []
  for (let bigCode = 1; bigCode <= 5; ++bigCode) {
    let subData = {
      title: bigCode + 'XX',
      value: bigCode,
      color: 'blue',
      children: [
      ],
    }
    let color = null
    if (bigCode == 2) {
      color = 'green'
    } else if (bigCode == 4) {
      color = 'orange'
    } else if (bigCode == 5) {
      color = 'red'
    }
    for (let j in codes[bigCode - 1]) {
      let item = {
        title: codes[bigCode - 1][j],
        value: codes[bigCode - 1][j],
        color: color,
      }
      subData['children'].push(item)
    }
    data.push(subData)
  }
  return data
}
const StatusCodeTreeData = createStatusCodeTreeData()

const computePluginInstallType = (item) => {
  let result = {
    text: "",
    color: ""
  }
  if (item.builtin) {
    result.text = "内置"
    result.color = "green"
  } else if (item.organizationId == null || item.organizationId == undefined || item.organizationId == "") {
    result.text = "自定义-共享"
    result.color = "blue"
  } else {
    result.text = "自定义-组织私有"
    result.color = "orange"
  }
  return result
}

export {
  Role, RoleSelectOptions, DefaultPaginationConf, colorForHttpMethod,
  userBaseInfoFormCheckRule, StatusCodeTreeData, computePluginInstallType
}