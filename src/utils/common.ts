export function ellipsisMiddle(str: string | number | undefined, leftNum = 6, rightNum = 4) {
  if (str === undefined) {
    return ''
  }
  const newStr = str.toString()
  if (leftNum + rightNum >= newStr.length) return newStr
  return newStr.substr(0, leftNum) + '...' + newStr.substr(-rightNum)
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function isJsonArray(str: string) {
  try {
    const obj = JSON.parse(str)
    return Array.isArray(obj)
  } catch (e) {
    return false
  }
}

export function isReadFunc(item: any) {
  return item['stateMutability'] === 'view'
}

export function isWriteFunc(item: any) {
  return item['stateMutability'] === 'nonpayable' || item['stateMutability'] === 'payable'
}

export function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function formatJson(json: string) {
  try {
    return JSON.stringify(
      JSON.parse(json, (_, value) => {
        if (typeof value === 'number') {
          return BigInt(value).toString()
        }
        if (typeof value === 'bigint') {
          return value.toString()
        }
        return value
      }),
      undefined,
      2
    )
  } catch (e) {
    return json
  }
}
