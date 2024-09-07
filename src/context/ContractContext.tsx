import { useLocalStorage, useMount } from 'react-use'
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
  delContractOutput: (id: string) => void
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
  delContractOutput: () => {},
  clearContractOutput: () => {},
  updateSelectedContractId: () => {},
  resetStorage: () => {},
})

const emptyStorageData: StorageStruct = {
  selectedContractId: '',
  contracts: [],
  outputs: [],
}

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const defaultData = useMemo(() => {
    return {
      selectedContractId: DefaultContract.id,
      contracts: [DefaultContract],
      outputs: [],
    }
  }, [])

  const [storageData, setStorageData] = useLocalStorage<StorageStruct>(ContractDataKey, defaultData)

  useMount(() => {
    if (!storageData || storageData.contracts.length === 0) {
      setStorageData(defaultData)
    }
  })

  const contracts = useMemo(() => {
    return storageData?.contracts ?? []
  }, [storageData])

  const outputs = useMemo(() => {
    return storageData?.outputs ?? []
  }, [storageData])

  const selectedContractId = useMemo(() => {
    return storageData?.selectedContractId ?? ''
  }, [storageData])

  const selectedContract = useMemo(() => {
    return contracts.find(c => c.id === selectedContractId)
  }, [contracts, selectedContractId])

  function addContract(contract: ContractParams, switchId: boolean) {
    const data = storageData ?? emptyStorageData
    const i = contracts.find(c => c.id === contract.id)
    if (i) {
      return
    }

    setStorageData({
      ...data,
      selectedContractId: switchId ? contract.id : data.selectedContractId,
      contracts: [...data.contracts, contract],
    })
  }

  function updateContract(contract: ContractParams) {
    const data = storageData ?? emptyStorageData

    const index = data.contracts.findIndex(c => c.id === contract.id)
    const newContracts = data.contracts
    newContracts[index] = contract

    setStorageData({
      ...data,
      contracts: newContracts,
    })
  }

  function removeContract(id: string) {
    const data = storageData ?? emptyStorageData

    setStorageData({
      ...data,
      outputs: data.outputs.filter(item => item.contractId !== id),
      contracts: data.contracts.filter(c => c.id !== id),
    })
  }

  function addContractOutput(output: ContractOutput) {
    const data = storageData ?? emptyStorageData

    setStorageData({
      ...data,
      outputs: [output, ...data.outputs],
    })
  }

  function delContractOutput(id: string) {
    const data = storageData ?? emptyStorageData

    setStorageData({
      ...data,
      outputs: data.outputs.filter(item => item.id !== id),
    })
  }

  function clearContractOutput() {
    const data = storageData ?? emptyStorageData

    setStorageData({
      ...data,
      outputs: [],
    })
  }

  function updateSelectedContractId(id: string) {
    const data = storageData ?? emptyStorageData

    setStorageData({
      ...data,
      selectedContractId: id,
    })
  }

  function resetStorage() {
    setStorageData(defaultData)
  }

  return (
    <ContractContext.Provider
      value={{
        storageData: storageData ?? defaultData,
        contracts,
        outputs,
        selectedContractId,
        selectedContract,
        addContract,
        updateContract,
        removeContract,
        addContractOutput,
        delContractOutput,
        clearContractOutput,
        updateSelectedContractId,
        resetStorage,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}
