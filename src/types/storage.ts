import { ContractOutput, ContractParams } from './contract'

export interface StorageStruct {
  selectedContractId: string
  contracts: ContractParams[]
  outputs: ContractOutput[]
}
