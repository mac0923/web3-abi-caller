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
