import { useLocalStorage } from 'react-use'
import { useMemo, createContext } from 'react'
import { ContractDataKey } from '@/config/storageKeys'
import { ContractParams, ContractOutput, StorageStruct } from '@/types'
import { DefaultContract } from '@/config/contract'

export const ContractContext = createContext<{
  storageData: StorageStruct
  contracts: ContractParams[]
  outputs: ContractOutput[]
  selectedContractId: string
  selectedContract: ContractParams | undefined
  addContract: (contract: ContractParams, switchId: boolean) => void
  updateContract: (contract: ContractParams) => void
  removeContract: (id: string) => void
  addContractOutput: (output: ContractOutput) => void
  clearContractOutput: () => void
  updateSelectedContractId: (id: string) => void
  resetStorage: () => void
}>({
  storageData: {
    selectedContractId: '',
    contracts: [],
    outputs: [],
  },
  contracts: [],
  outputs: [],
  selectedContractId: '',
  selectedContract: undefined,
  addContract: () => {},
  updateContract: () => {},
  removeContract: () => {},
  addContractOutput: () => {},
  clearContractOutput: () => {},
  updateSelectedContractId: () => {},
  resetStorage: () => {},
})

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const defaultData = useMemo(() => {
    return {
      selectedContractId: DefaultContract.id,
      contracts: [DefaultContract],
      outputs: [],
    }
  }, [])

  const [data, setData] = useLocalStorage<StorageStruct>(ContractDataKey, defaultData)

  const storageData = useMemo(() => {
    if (!data || data.contracts.length === 0) {
      return defaultData
    }
    return data
  }, [data, defaultData])

  const contracts = useMemo(() => {
    return storageData.contracts
  }, [storageData])

  const outputs = useMemo(() => {
    return storageData.outputs
  }, [storageData])

  const selectedContractId = useMemo(() => {
    return storageData.selectedContractId
  }, [storageData])

  const selectedContract = useMemo(() => {
    return contracts.find(c => c.id === selectedContractId)
  }, [contracts, selectedContractId])

  function addContract(contract: ContractParams, switchId: boolean) {
    const i = storageData.contracts.find(c => c.id === contract.id)
    if (i) {
      return
    }

    setData({
      ...storageData,
      selectedContractId: switchId ? contract.id : storageData.selectedContractId,
      contracts: [...storageData.contracts, contract],
    })
  }

  function updateContract(contract: ContractParams) {
    const index = storageData.contracts.findIndex(c => c.id === contract.id)
    const newContracts = storageData.contracts
    newContracts[index] = contract

    setData({
      ...storageData,
      contracts: newContracts,
    })
  }

  function removeContract(id: string) {
    setData({
      ...storageData,
      outputs: storageData.outputs.filter(item => item.contractId !== id),
      contracts: storageData.contracts.filter(c => c.id !== id),
    })
  }

  function addContractOutput(output: ContractOutput) {
    setData({
      ...storageData,
      outputs: [...storageData.outputs, output],
    })
  }

  function clearContractOutput() {
    setData({
      ...storageData,
      outputs: [],
    })
  }

  function updateSelectedContractId(id: string) {
    setData({
      ...storageData,
      selectedContractId: id,
    })
  }

  function resetStorage() {
    setData(defaultData)
  }

  return (
    <ContractContext.Provider
      value={{
        storageData,
        contracts,
        outputs,
        selectedContractId,
        selectedContract,
        addContract,
        updateContract,
        removeContract,
        addContractOutput,
        clearContractOutput,
        updateSelectedContractId,
        resetStorage,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}
