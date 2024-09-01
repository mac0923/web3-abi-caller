export interface ContractOutput {
  id: string
  contractId: string
  blockNumber: number
  funcName: string
  inputs: string[]
  outputs: string[]
}

export interface ContractParams {
  id: string
  chainId: number
  isUseWallet: boolean
  address: string
  name: string
  abi: string
  specifyBlock: boolean
}
