export interface ContractOutput {
  id: string // uuid
  contractId: string
  blockNumber: number
  funcName: string
  inputs: string[]
  outputs: string[]
}

export interface ContractParams {
  id: string // base64 code
  chainId: number
  isUseWallet: boolean
  address: string
  name: string
  abi: string // json string
  specifyBlock: boolean
}
