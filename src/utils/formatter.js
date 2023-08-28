const timeMillisDisplay = (num) => {
  if (num < 1000) {
    return [num, "毫秒"]
  } else if (num < 1000 * 60) {
    return [(num / 1000).toFixed(1), "秒"]
  } else if (num < 1000 * 60 * 60) {
    return [(num / 1000 / 60).toFixed(1), "分"]
  } else {
    return [(num / 1000 / 60 / 60).toFixed(1), "时"]
  }
}

const colorForResponseStatus = (status) => {
  if (status>= 200 && status < 300) {
    return 'green'
  } else if (status >= 300 && status < 400) {
    return 'blue'
  } else if (status >= 400 && status < 500) {
    return 'orange'
  } else if (status >= 500 && status < 600) {
    return 'red'
  } else {
    return null
  }
}

const colorForRequestTimeMillisCost = (timeMillis) =>  {
  if (timeMillis < 50) {
    // dark green
    return '#137752'
  } else if (timeMillis < 100) {
    // green
    return ' #19a974'
  } else if (timeMillis < 500) {
    // light green
    return '#9eebcf'
  } else if (timeMillis < 1000) {
    // yellow
    return '#ffde37'
  } else if (timeMillis < 5000) {
    // light red
    return '#ff725c'
  } else if (timeMillis < 10000) {
    // red
    return '#ff6300'
  } else {
    // dark-red
    return '#e7040f'
  }
}

const byteCountDisplay = (num) => {
  if (num < 1014) {
    return [num, 'B']
  } else if (num < 1024 * 1024) {
    return [(num / 1024 ).toFixed(2), 'KB']
  } else if (num < 1024 * 1024 * 1024) {
    return [(num / 1024 / 1024 ).toFixed(2), 'MB']
  } else if (num < 1024 * 1024 * 1024 * 1024) {
    return [(num / 1024 / 1024 / 1024 ).toFixed(2), 'GB']
  }
}

const httpHeadersDisplay = (headers) => {
  let content = ''
  for (let headerName in headers) {
    for (let index in headers[headerName]) {
      let line = headerName + ': ' + headers[headerName][index] + '\n'
      content = content + line
    }
  }
  return content
}

export { timeMillisDisplay, colorForResponseStatus, colorForRequestTimeMillisCost, byteCountDisplay, httpHeadersDisplay }
