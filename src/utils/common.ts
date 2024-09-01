export function ellipsisMiddle(str: string | number | undefined, leftNum = 6, rightNum = 4) {
  if (str === undefined) {
    return ''
  }
  const newStr = str.toString()
  if (leftNum + rightNum >= newStr.length) return newStr
  return newStr.substr(0, leftNum) + '...' + newStr.substr(-rightNum)
}
