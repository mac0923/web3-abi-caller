import { Base64 } from 'js-base64'

export function encodeContractId(chainId: string, address: string): string {
  const str = `${chainId}-${address}`
  return Base64.encode(str, true)
}

export function decodeContractId(contractId: string): { chainId: string; address: string } {
  const str = Base64.decode(contractId)
  const [chainId, address] = str.split('-')
  return { chainId, address }
}
