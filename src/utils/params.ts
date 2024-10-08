import { ParamType } from 'ethers'
import { parseJson } from './common'

function formatBaseTypeValue(param: any, paramType: ParamType): any {
  const baseType = paramType.baseType

  if (
    baseType.includes('int') ||
    baseType.includes('bytes') ||
    baseType === 'address' ||
    baseType === 'string'
  ) {
    return String(param)
  }

  if (baseType === 'bool') {
    return Boolean(param)
  }

  return param
}

function formatTupleTypeValue(param: any, paramType: ParamType): any {
  paramType
  return param
}

function formatArrayTypeValue(param: any, paramType: ParamType): any {
  const paramToArrayVal: any[] = parseJson(param.replace(/'/g, '"'))

  const childrenParamType = paramType.arrayChildren

  if (!childrenParamType) {
    return []
  }

  if (childrenParamType.baseType === 'array') {
    return paramToArrayVal.map(item => {
      return formatArrayTypeValue(item, childrenParamType)
    })
  }

  return paramToArrayVal.map(item => {
    return formatBaseTypeValue(item, childrenParamType)
  })
}

export function formatInputParams(params: any[], paramsType: ReadonlyArray<ParamType>): any[] {
  const result: any[] = []

  for (let i = 0; i < params.length; i++) {
    const param = params[i]
    const paramType = paramsType[i]

    const baseType = paramType.baseType

    if (baseType === 'array') {
      result.push(formatArrayTypeValue(param, paramType))
      continue
    }

    if (baseType === 'tuple') {
      result.push(formatTupleTypeValue(param, paramType))
      continue
    }

    result.push(formatBaseTypeValue(param, paramType))
  }
  return result
}
