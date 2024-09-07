import { useContext, useEffect, useMemo, useState } from 'react'
import { isAddress } from 'viem'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/react'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { TrashIcon, Pencil2Icon } from '@radix-ui/react-icons'
import classnames from 'classnames'
import JSONBig from 'json-bigint'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import {
  capitalizeFirstLetter,
  ellipsisMiddle,
  formatJson,
  generateUuid,
  isReadFunc,
  isWriteFunc,
} from '@/utils'
import { ContractContext } from '@/context/ContractContext'
import { ChainConfigs, ChainId, SUPPORTED_CHAINS } from '@/config/chain'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { isJsonArray } from '@/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { readContract, writeContract } from '@/utils/contract'
import { getEthersProvider, getEthersSigner } from '@/utils/chain'
import { wagmiConfig } from '@/config/wagmi-config'

function MoreOptionsLine() {
  const { selectedContractId, selectedContract, removeContract, updateContract } =
    useContext(ContractContext)

  function EditButton() {
    const [name, setName] = useState('')
    const [showDialog, setShowDialog] = useState(false)

    function updateName(e: React.ChangeEvent<HTMLInputElement>) {
      setName(e.target.value)
    }

    const [chain, setChain] = useState(ChainId.Mainnet.toString())

    const [address, setAddress] = useState('')
    function updateAddress(e: React.ChangeEvent<HTMLInputElement>) {
      setAddress(e.target.value)
    }

    const [abi, setAbi] = useState('')
    function updateAbi(e: React.ChangeEvent<HTMLTextAreaElement>) {
      setAbi(e.target.value)
    }

    useEffect(() => {
      if (selectedContract) {
        setName(selectedContract.name)
        setChain(selectedContract.chainId.toString())
        setAddress(selectedContract.address)
        setAbi(selectedContract.abi)
      }
    }, [])

    const validateAddress = useMemo(() => {
      return isAddress(address)
    }, [address])

    const validateAbi = useMemo(() => {
      return isJsonArray(abi)
    }, [abi])

    const confirmDisabled = useMemo(() => {
      if (name && chain && address && abi && validateAddress && validateAbi) {
        return false
      }
      return true
    }, [name, chain, address, abi, validateAddress, validateAbi])

    function onConfirm() {
      if (!selectedContract) {
        return
      }
      updateContract({
        ...selectedContract,
        chainId: Number(chain),
        address: address,
        name: name,
        abi: abi,
      })
      setShowDialog(false)
    }

    return (
      <Dialog open={showDialog} onOpenChange={v => setShowDialog(v)}>
        <DialogTrigger asChild>
          <Button className="mr-[6px]" variant="outline">
            <div className="flex items-center">
              <Pencil2Icon className="mr-[6px]"></Pencil2Icon> {t`Edit`}
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t`Add Contract`}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center mb-[16px] mt-[24px]">
                <div className="w-[68px]">{t`Name`}</div>
                <div className="w-[calc(100%-68px)]">
                  <Input value={name} onInput={updateName} placeholder={t`Name`} />
                </div>
              </div>
              <div className="flex items-center mb-[16px]">
                <div className="w-[68px]">{t`Chain`}</div>
                <div className="w-[calc(100%-68px)]">
                  <Select defaultValue={chain} onValueChange={(v: string) => setChain(v)}>
                    <SelectTrigger className="w-[100%]">
                      <SelectValue placeholder={t`Chain`} />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_CHAINS.map(id => (
                        <SelectItem className="cursor-pointer" key={id} value={id.toString()}>
                          {ChainConfigs[id].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center mb-[16px]">
                <div className="w-[68px]">{t`Contract`}</div>
                <div className="w-[calc(100%-68px)]">
                  <Input value={address} onInput={updateAddress} placeholder={t`Contract`} />
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-[68px]">{t`Abi`}</div>
                <div className="w-[calc(100%-68px)]">
                  <Textarea
                    value={abi}
                    onInput={updateAbi}
                    className="h-[120px]"
                    placeholder={t`Abi`}
                  />
                </div>
              </div>
              <div className="mt-[24px] flex items-center justify-end">
                <Button
                  variant="outline"
                  className="mr-[16px] bg-orange-500 text-white hover:bg-orange-400"
                  onClick={() => setShowDialog(false)}
                >{t`Cancel`}</Button>
                <Button
                  onClick={onConfirm}
                  disabled={confirmDisabled}
                  variant="outline"
                  className="bg-sky-500 text-white hover:bg-sky-400"
                >{t`Confirm`}</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  const DeleteButton = () => {
    const [showDialog, setShowDialog] = useState(false)

    function onDeleteContract() {
      removeContract(selectedContractId)
      setShowDialog(false)
    }

    return (
      <AlertDialog open={showDialog} onOpenChange={v => setShowDialog(v)}>
        <AlertDialogTrigger asChild>
          <Button className="mr-[6px]" variant="outline">
            <div className="flex items-center">
              <TrashIcon className="mr-[4px]"></TrashIcon> {t`Delete`}
            </div>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`Confirm deletion?`}</AlertDialogTitle>
            <AlertDialogDescription>
              {t`Confirming the deletion of the ${selectedContract?.name ?? ''} contract?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteContract}>{t`Confirm`}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <>
      <div className="flex items-center justify-end p">
        <EditButton></EditButton>
        <DeleteButton></DeleteButton>
      </div>
    </>
  )
}

function ContractInfoLine() {
  const { selectedContract } = useContext(ContractContext)

  return (
    <>
      <div className="mt-[12px]">
        <div className="flex justify-between border-b leading-[42px] text-[16px]">
          <div className="w-[33.3%] pl-[12px] text-zinc-300">
            <Trans id="contract-name">Name</Trans>
          </div>
          <div className="w-[33.3%] text-zinc-300">{t`Chain`}</div>
          <div className="w-[33.3%] text-zinc-300">{t`Address`}</div>
        </div>
        <div className="flex justify-between border-b leading-[52px] text-[15px]">
          <div className="w-[33.3%] pl-[12px]">
            {selectedContract ? selectedContract.name : '--'}
          </div>
          <div className="w-[33.3%]">
            {selectedContract ? ChainConfigs[selectedContract.chainId]?.name ?? '--' : '--'}
          </div>
          <div className="w-[33.3%]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="underline">
                  {selectedContract ? ellipsisMiddle(selectedContract.address) : '--'}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{selectedContract ? selectedContract.address : '--'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  )
}

function FunctionList({ onSelect }: { onSelect: (p: { name: string; isWrite: boolean }) => void }) {
  const { selectedContract } = useContext(ContractContext)

  const functions = useMemo(() => {
    const abi = JSON.parse(selectedContract?.abi ?? '[]') as any[]
    return abi.filter(item => item['type'] === 'function')
  }, [selectedContract?.abi])

  const readFunctions = useMemo(() => functions.filter(item => isReadFunc(item)), [functions])
  const writeFunctions = useMemo(() => functions.filter(item => isWriteFunc(item)), [functions])

  return (
    <>
      <ScrollArea className="h-[520px] w-full function-list">
        {readFunctions.map((item, index) => (
          <div
            key={`read-${index}`}
            onClick={() =>
              item['name']
                ? onSelect({
                    name: item['name'],
                    isWrite: false,
                  })
                : undefined
            }
            className="flex items-center h-[52px] cursor-pointer hover:text-sky-500 func-item [&:not(:last-child)]:border-b"
          >
            <div className="border-[1px] border-orange-300 text-orange-400 rounded-[4px] text-[11px] pl-[4px] pr-[4px] pt-[2px] pb-[2px] mr-[8px]">{t`Read`}</div>
            {item['name'] ?? '--'}
          </div>
        ))}
        {writeFunctions.map((item, index) => (
          <div
            key={`write-${index}`}
            onClick={() =>
              item['name']
                ? onSelect({
                    name: item['name'],
                    isWrite: true,
                  })
                : undefined
            }
            className="flex items-center h-[52px] cursor-pointer hover:text-sky-500 func-item [&:not(:last-child)]:border-b"
          >
            <div className="border-[1px] border-sky-300 text-sky-400 rounded-[4px] text-[11px] pl-[4px] pr-[4px] pt-[2px] pb-[2px] mr-[8px]">{t`Write`}</div>
            {item['name'] ?? '--'}
          </div>
        ))}
      </ScrollArea>
    </>
  )
}

function FunctionInfoLine({ funcName, isWrite }: { funcName: string; isWrite: boolean }) {
  const { selectedContract, updateContract } = useContext(ContractContext)

  function setSpecifyBlockNumber(v: boolean) {
    if (!selectedContract) {
      return
    }
    updateContract({
      ...selectedContract,
      specifyBlock: v,
    })
  }

  return (
    <>
      <div className="flex items-center justify-between p-[12px]">
        <div className="flex items-center text-[15px]">
          <span
            className={classnames('font-medium', [!isWrite ? 'text-orange-400' : 'text-sky-400'])}
          >
            {t`Function`}:&nbsp;
          </span>
          {funcName}
        </div>
        <div className="flex items-center">
          <Switch
            defaultChecked={selectedContract?.specifyBlock ?? false}
            onCheckedChange={setSpecifyBlockNumber}
          ></Switch>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="ml-[6px] text-[14px] underline">{t`BlockNumber`}</TooltipTrigger>
              <TooltipContent>
                <div>
                  <div>{t`Fetch data from the specified blockNumber`}</div>
                  <br />
                  <div>
                    ⚠️&nbsp;{t`Not all rpc nodes support specifying blocks to read data from`}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  )
}

function FunctionInputs({ funcName, isWrite }: { funcName: string; isWrite: boolean }) {
  const { selectedContract, clearContractOutput, addContractOutput } = useContext(ContractContext)
  const { isConnected } = useAccount()

  const [running, setRunning] = useState(false)
  const [values, setValues] = useState<string[]>([])
  const [blockNumber, setBlockNumber] = useState('')

  useEffect(() => {
    setValues([])
  }, [funcName])

  const functions = useMemo(() => {
    const abi = JSON.parse(selectedContract?.abi ?? '[]') as any[]
    return abi.filter(item => item['type'] === 'function')
  }, [selectedContract?.abi])

  const selectedFunction = useMemo(
    () =>
      functions.find(
        item =>
          item['name'] === funcName &&
          ((isWrite && isWriteFunc(item)) || (!isWrite && isReadFunc(item)))
      ),
    [functions, funcName, isWrite]
  )

  const functionInputItems = useMemo(() => {
    if (!selectedFunction) {
      return []
    }
    return selectedFunction['inputs'] as { name: string; type: string }[]
  }, [selectedFunction])

  function updateValue(e: React.FormEvent<HTMLInputElement>, index: number) {
    if (values.length === 0) {
      const newValues = functionInputItems.map(() => '')
      setValues(newValues)
    }
    const target = e.target as HTMLInputElement
    const newValues = [...values]
    newValues[index] = target.value
    setValues(newValues)
  }

  function updateBlockNumber(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement
    setBlockNumber(target.value)
  }

  async function onRunFunc() {
    const call = async () => {
      if (!selectedContract) {
        return
      }
      if (isWrite && !isConnected) {
        toast.error(t`Please connect wallet first`, { duration: 3000, style: { fontSize: '16px' } })
        return
      }
      let result
      if (isWrite) {
        const signer = await getEthersSigner(wagmiConfig, { chainId: selectedContract.chainId })
        result = await writeContract({
          signer: signer,
          address: selectedContract.address,
          abi: selectedContract.abi,
          funcName: funcName,
          args: values,
        })
      } else {
        const provider = await getEthersProvider(wagmiConfig, { chainId: selectedContract.chainId })
        if (!provider) {
          toast.error(t`Failed to get provider`, { duration: 3000, style: { fontSize: '16px' } })
          return
        }
        result = await readContract({
          provider: provider,
          address: selectedContract.address,
          abi: selectedContract.abi,
          funcName: funcName,
          args: values,
        })
      }
      addContractOutput({
        id: generateUuid(),
        contractId: selectedContract.id,
        blockNumber: blockNumber ? Number(blockNumber) : undefined,
        funcName: funcName,
        inputs: values,
        output: JSONBig.stringify(result.data),
        isError: result.isError,
        errMsg: result.isError ? result.data : undefined,
      })
    }

    try {
      setRunning(true)
      await call()
    } finally {
      setRunning(false)
    }
  }

  return (
    <>
      {funcName ? (
        <div>
          {functionInputItems.length > 0 ? (
            <div className="flex items-center justify-between leading-[42px] border-b text-[16px]">
              <div className="w-[30%] pl-[8px] flex items-center">
                <Trans id="func-name">Name</Trans>
              </div>
              <div className="w-[28%] flex items-center">{t`Type`}</div>
              <div className="w-[42%] flex items-center justify-center">{t`Value`}</div>
            </div>
          ) : undefined}
          {functionInputItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between leading-[56px] border-b text-[15px]"
            >
              <div className="w-[30%] pl-[8px]">{capitalizeFirstLetter(item.name)}</div>
              <div className="w-[28%]">{capitalizeFirstLetter(item.type)}</div>
              <div className="w-[42%]">
                <Input
                  key={index}
                  className="w-[calc(100%-4px)]"
                  value={values[index] ?? ''}
                  onInput={e => updateValue(e, index)}
                  placeholder={`${capitalizeFirstLetter(item.name)}(${capitalizeFirstLetter(item.type)})`}
                />
              </div>
            </div>
          ))}
          {selectedContract?.specifyBlock && !isWrite ? (
            <div className="flex items-center justify-between leading-[56px] border-b text-[15px]">
              <div className="w-[30%] pl-[8px]">BlockNumber</div>
              <div className="w-[28%]">Number</div>
              <div className="w-[42%]">
                <Input
                  className="w-[calc(100%-4px)]"
                  value={blockNumber}
                  onInput={e => updateBlockNumber(e)}
                  placeholder="BlockNumber(Number)"
                />
              </div>
            </div>
          ) : undefined}
        </div>
      ) : undefined}

      <div className="flex justify-end mr-[12px] mt-[22px]">
        <Button
          disabled={!funcName || running}
          className="mr-[20px] w-[106px] bg-sky-500 text-white hover:bg-sky-400"
          onClick={onRunFunc}
        >
          {!running ? t`Run` : t`Running...`}
        </Button>

        <Button
          className="w-[106px] bg-orange-500 text-white hover:bg-orange-400"
          onClick={clearContractOutput}
        >{t`Clear Out`}</Button>
      </div>
    </>
  )
}

function FunctionOutputs() {
  const { outputs, contracts, delContractOutput } = useContext(ContractContext)

  function getContractName(contractId: string) {
    const contract = contracts.find(c => c.id === contractId)
    return contract ? contract.name : '--'
  }

  function getChainName(contractId: string) {
    const contract = contracts.find(c => c.id === contractId)
    return contract ? ChainConfigs[Number(contract.chainId)].name : '--'
  }

  return (
    <>
      <div className="mt-[24px] mb-[24px]">
        {outputs.map((item, index) => (
          <div
            key={index}
            className="ml-[24px] mr-[24px] border [&:not(:first-child)]:mt-[16px] rounded-[6px]"
          >
            <div className="flex items-center justify-between h-[36px] border-b pl-[8px] pr-[8px] text-[15px]">
              <div>{`${getContractName(item.contractId)}(${getChainName(item.contractId)}): ${item.funcName}`}</div>
              <div className="flex items-center">
                {item.blockNumber ? (
                  <div>
                    {t`BlockNumber`}: {item.blockNumber}
                  </div>
                ) : undefined}
                <TrashIcon
                  onClick={() => delContractOutput(item.id)}
                  className="ml-[8px] cursor-pointer hover:text-red-500"
                ></TrashIcon>
              </div>
            </div>
            <div>
              <ScrollArea className="w-[55vw]">
                <div
                  className={classnames('pl-[12px] pr-[12px] pt-[6px] pb-[6px] text-[15px]', [
                    item.isError ? 'text-red-500' : 'text-white',
                  ])}
                >
                  <pre className="pl-[12px] pr-[12px] pt-[6px] pb-[6px] max-h-[220px]">
                    {item.isError ? JSON.stringify(item.errMsg) : formatJson(item.output)}
                  </pre>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default function ContractPanel() {
  const { selectedContract } = useContext(ContractContext)

  const [selectedFunc, setSelectedFunc] = useState({
    name: '',
    isWrite: false,
  })

  return (
    <>
      {selectedContract ? (
        <div className="p-[16px]">
          <div>
            <MoreOptionsLine></MoreOptionsLine>
          </div>
          <div>
            <ContractInfoLine></ContractInfoLine>
          </div>
          <ResizablePanelGroup direction="horizontal" className="!h-[520px]">
            <ResizablePanel minSize={12} maxSize={32} defaultSize={14}>
              <FunctionList onSelect={setSelectedFunc}></FunctionList>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              {selectedFunc.name ? (
                <FunctionInfoLine
                  funcName={selectedFunc.name}
                  isWrite={selectedFunc.isWrite}
                ></FunctionInfoLine>
              ) : undefined}
              <ScrollArea className="h-[472px] w-full p-[12px]">
                <FunctionInputs
                  funcName={selectedFunc.name}
                  isWrite={selectedFunc.isWrite}
                ></FunctionInputs>
                <FunctionOutputs></FunctionOutputs>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ) : undefined}
    </>
  )
}
