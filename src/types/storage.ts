import { ContractOutput, ContractParams } from './contract'

export interface StorageItem {
  contract: ContractParams
  output: ContractOutput[]
}
