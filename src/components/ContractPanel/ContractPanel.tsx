import { useContext, useMemo, useState } from 'react'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/react'
import classnames from 'classnames'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import { capitalizeFirstLetter, ellipsisMiddle } from '@/utils'
import { ContractContext } from '@/context/ContractContext'
import { ChainConfigs } from '@/config/chain'

function MoreOptionsLine() {
  return (
    <>
      <div className="flex items-center justify-end p">
        <Button className="mr-[6px]" variant="outline">
          Option 1
        </Button>
        <Button className="mr-[6px]" variant="outline">
          Option 2
        </Button>
        <Button className="mr-[6px]" variant="outline">
          Option 3
        </Button>
      </div>
    </>
  )
}

function ContractInfoLine() {
  const { selectedContractId, contracts } = useContext(ContractContext)

  const selectedContract = useMemo(() => {
    return contracts.find(c => c.id === selectedContractId)
  }, [contracts, selectedContractId])

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

function FunctionList() {
  const MockFunctions: { name: string; isWrite: boolean }[] = [
    {
      name: 'decimals',
      isWrite: false,
    },
    {
      name: 'balanceOf',
      isWrite: false,
    },
    {
      name: 'symbol',
      isWrite: false,
    },
    {
      name: 'approve',
      isWrite: true,
    },
    {
      name: 'transfer',
      isWrite: true,
    },
  ]

  const readFunctions = useMemo(() => MockFunctions.filter(item => !item.isWrite), [MockFunctions])
  const writeFunctions = useMemo(() => MockFunctions.filter(item => item.isWrite), [MockFunctions])

  return (
    <>
      <ScrollArea className="h-[520px] w-full function-list">
        {readFunctions.map((item, index) => (
          <div
            key={`read-${index}`}
            className="flex items-center h-[52px] cursor-pointer hover:text-sky-500 func-item [&:not(:last-child)]:border-b"
          >
            <div className="border-[1px] border-orange-300 text-orange-400 rounded-[4px] text-[11px] pl-[4px] pr-[4px] pt-[2px] pb-[2px] mr-[8px]">{t`Read`}</div>
            {item.name}
          </div>
        ))}
        {writeFunctions.map((item, index) => (
          <div
            key={`write-${index}`}
            className="flex items-center h-[52px] cursor-pointer hover:text-sky-500 func-item [&:not(:last-child)]:border-b"
          >
            <div className="border-[1px] border-sky-300 text-sky-400 rounded-[4px] text-[11px] pl-[4px] pr-[4px] pt-[2px] pb-[2px] mr-[8px]">{t`Write`}</div>
            {item.name}
          </div>
        ))}
      </ScrollArea>
    </>
  )
}

function FunctionInfoLine() {
  const isWrite = false
  const [specifyBlockNumber, setSpecifyBlockNumber] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between p-[12px]">
        <div className="flex items-center text-[15px]">
          <span
            className={classnames('font-medium', [!isWrite ? 'text-orange-400' : 'text-sky-400'])}
          >
            {t`Function`}:&nbsp;
          </span>
          BalanceOf
        </div>
        <div className="flex items-center">
          <Switch
            defaultChecked={specifyBlockNumber}
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

function FunctionInputs({ specifyBlockNumber }: { specifyBlockNumber: boolean }) {
  const [values, setValues] = useState<string[]>([])
  const [blockNumber, setBlockNumber] = useState('')

  const MockInputItems: { name: string; type: string }[] = [
    {
      name: 'account',
      type: 'address',
    },
    {
      name: 'decimals',
      type: 'uint256',
    },
  ]

  function updateValue(e: React.FormEvent<HTMLInputElement>, index: number) {
    if (values.length === 0) {
      const newValues = MockInputItems.map(() => '')
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

  return (
    <>
      <div>
        <div className="flex items-center justify-between leading-[42px] border-b text-[16px]">
          <div className="w-[30%] pl-[8px] flex items-center">
            <Trans id="func-name">Name</Trans>
          </div>
          <div className="w-[28%] flex items-center">{t`Type`}</div>
          <div className="w-[42%] flex items-center justify-center">{t`Value`}</div>
        </div>
        {MockInputItems.map((item, index) => (
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
        {specifyBlockNumber ? (
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
    </>
  )
}

function FunctionOptionButtons() {
  return (
    <>
      <div className="flex justify-end mr-[12px] mt-[22px]">
        <Button className="mr-[20px] w-[106px] bg-sky-500 text-white hover:bg-sky-400">{t`Run`}</Button>
        <Button className="w-[106px] bg-orange-500 text-white hover:bg-orange-400">{t`Clear Out`}</Button>
      </div>
    </>
  )
}

function FunctionOutputs() {
  const MockOutputItems: {
    contractName: string
    chainName: string
    funcName: string
    blockNumber?: number
    isError?: boolean
    errMsg?: string
    result?: string
  }[] = [
    {
      contractName: 'USDC ERC20',
      chainName: 'Arb',
      funcName: 'balanceOf',
      blockNumber: 123456,
      isError: false,
      result: '100',
    },
    {
      contractName: 'DAI ERC20',
      chainName: 'Arb',
      funcName: 'Decimals',
      blockNumber: 123456,
      isError: false,
      result: '18',
    },
    {
      contractName: 'DAI ERC20',
      chainName: 'Eth',
      funcName: 'Decimals',
      isError: true,
      errMsg: 'Chain Error',
    },
  ]

  return (
    <>
      <div className="mt-[24px] mb-[24px]">
        {MockOutputItems.map((item, index) => (
          <div
            key={index}
            className="ml-[24px] mr-[24px] border [&:not(:first-child)]:mt-[16px] rounded-[6px]"
          >
            <div className="flex items-center justify-between h-[36px] border-b pl-[8px] pr-[8px] text-[15px]">
              <div>{`${item.contractName}(${item.chainName}): ${item.funcName}`}</div>
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
                {item.isError ? item.errMsg : item.result}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default function ContractPanel() {
  return (
    <>
      <div className="p-[16px]">
        <div>
          <MoreOptionsLine></MoreOptionsLine>
        </div>
        <div>
          <ContractInfoLine></ContractInfoLine>
        </div>
        <ResizablePanelGroup direction="horizontal" className="!h-[520px]">
          <ResizablePanel minSize={12} maxSize={32} defaultSize={14}>
            <FunctionList></FunctionList>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <FunctionInfoLine></FunctionInfoLine>
            <ScrollArea className="h-[472px] w-full p-[12px]">
              <FunctionInputs specifyBlockNumber></FunctionInputs>
              <FunctionOptionButtons></FunctionOptionButtons>
              <FunctionOutputs></FunctionOutputs>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  )
}
