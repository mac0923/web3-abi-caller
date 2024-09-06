export interface ContractOutput {
  id: string // uuid
  contractId: string
  funcName: string
  inputs: string[]
  output: string
  blockNumber?: number
  isError?: boolean
  errMsg?: any
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

export interface FunctionInputItem {
  name: string
  type: string
}
