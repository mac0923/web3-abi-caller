import { Base64 } from 'js-base64'
import { ethers } from 'ethers'

export function encodeContractId(chainId: string, address: string): string {
  const str = `${chainId}-${address}`
  return Base64.encode(str, true)
}

export function decodeContractId(contractId: string): { chainId: string; address: string } {
  const str = Base64.decode(contractId)
  const [chainId, address] = str.split('-')
  return { chainId, address }
}

export async function readContract({
  provider,
  address,
  abi,
  funcName,
  args,
  blockNumber,
}: {
  provider: ethers.JsonRpcProvider | ethers.FallbackProvider
  address: string
  abi: string
  funcName: string
  args: any[]
  blockNumber?: number
}): Promise<{ isError: boolean; data: any }> {
  const contract: ethers.Contract = new ethers.Contract(address, JSON.parse(abi), provider)

  try {
    return {
      isError: false,
      data: await contract[funcName](...args, blockNumber ? { blockTag: blockNumber } : {}),
    }
  } catch (e) {
    return {
      isError: true,
      data: e,
    }
  }
}

export async function writeContract({
  signer,
  address,
  abi,
  funcName,
  args,
}: {
  signer: ethers.Signer
  address: string
  abi: string
  funcName: string
  args: any[]
}): Promise<{ isError: boolean; data: any }> {
  const contract: ethers.Contract = new ethers.Contract(address, JSON.parse(abi), signer)

  try {
    return {
      isError: false,
      data: await contract[funcName](...args),
    }
  } catch (e: any) {
    return {
      isError: true,
      data: e,
    }
  }
}
