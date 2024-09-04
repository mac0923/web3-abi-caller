import { useContext, useMemo, useState } from 'react'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/react'
import { TrashIcon, Pencil2Icon } from '@radix-ui/react-icons'
import classnames from 'classnames'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import { capitalizeFirstLetter, ellipsisMiddle, isReadFunc, isWriteFunc } from '@/utils'
import { ContractContext } from '@/context/ContractContext'
import { ChainConfigs } from '@/config/chain'

function MoreOptionsLine() {
  const { selectedContractId, removeContract } = useContext(ContractContext)

  function onDeleteContract() {
    removeContract(selectedContractId)
  }

  return (
    <>
      <div className="flex items-center justify-end p">
        <Button className="mr-[6px]" variant="outline">
          <div className="flex items-center">
            <Pencil2Icon className="mr-[6px]"></Pencil2Icon> {t`Edit`}
          </div>
        </Button>
        <Button className="mr-[6px]" variant="outline" onClick={onDeleteContract}>
          <div className="flex items-center">
            <TrashIcon className="mr-[4px]"></TrashIcon> {t`Delete`}
          </div>
        </Button>
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
    const abi = JSON.parse(selectedContract?.abi ?? '[]') as never[]
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
  const { selectedContract, clearContractOutput } = useContext(ContractContext)

  const [values, setValues] = useState<string[]>([])
  const [blockNumber, setBlockNumber] = useState('')

  const functions = useMemo(() => {
    const abi = JSON.parse(selectedContract?.abi ?? '[]') as never[]
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

  function onRunFunc() {
    // TODO
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
          disabled={!funcName}
          className="mr-[20px] w-[106px] bg-sky-500 text-white hover:bg-sky-400"
          onClick={onRunFunc}
        >{t`Run`}</Button>
        <Button
          className="w-[106px] bg-orange-500 text-white hover:bg-orange-400"
          onClick={clearContractOutput}
        >{t`Clear Out`}</Button>
      </div>
    </>
  )
}

function FunctionOutputs() {
  const { outputs, contracts } = useContext(ContractContext)

  function getContractName(contractId: string) {
    const contract = contracts.find(c => c.id === contractId)
    return contract ? contract.name : '--'
  }

  function getChainName(contractId: string) {
    const contract = contracts.find(c => c.id === contractId)
    return contract ? ChainConfigs[Number(contract.id)].name : '--'
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
              {item.blockNumber ? (
                <div>
                  {t`BlockNumber`}: {item.blockNumber}
                </div>
              ) : undefined}
            </div>
            <div>
              <div
                className={classnames('pl-[8px] pr-[8px] pt-[4px] pb-[4px] text-[15px]', [
                  item.isError ? 'text-red-500' : 'text-white',
                ])}
              >
                {item.isError ? item.errMsg : item.output}
              </div>
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
