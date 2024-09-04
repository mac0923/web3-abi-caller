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
  addContract: (contract: ContractParams, switchId: boolean) => void
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
  addContract: () => {},
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
    return data ?? defaultData
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

  function removeContract(id: string) {
    setData({
      ...storageData,
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
        addContract,
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
