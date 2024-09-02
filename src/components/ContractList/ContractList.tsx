import { useMemo } from 'react'
import { LayersIcon, FileTextIcon } from '@radix-ui/react-icons'
import { ChainConfigs, ChainId } from '@/config/chain'
import { ContractParams } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

function GroupItem({ chainId, items }: { chainId: number; items: ContractParams[] }) {
  const chainConfig = useMemo(() => {
    return ChainConfigs[chainId]
  }, [chainId])

  return (
    <>
      <AccordionItem value={chainConfig.name}>
        <AccordionTrigger className="pl-[8px] pr-[8px]">
          <div className="flex items-center">
            <LayersIcon className="mr-[8px]"></LayersIcon>
            {chainConfig.name}
          </div>
        </AccordionTrigger>
        <AccordionContent className="!pb-0 cursor-pointer">
          {items.map((item, index) => (
            <div key={index} className="h-[52px] border-t flex items-center pl-[16px]">
              <FileTextIcon className="mr-[4px]"></FileTextIcon>
              <div className=" hover:underline">{item.name}</div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </>
  )
}

export default function ContractList() {
  const MockData: ContractParams[] = [
    {
      id: 'xx1',
      chainId: ChainId.Mainnet,
      isUseWallet: false,
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      name: 'USDC ERC20',
      abi: '[{"inputs":[{"internalType":"address","name":"implementationContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}]',
      specifyBlock: false,
    },
    {
      id: 'xx2',
      chainId: ChainId.Mainnet,
      isUseWallet: false,
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      name: 'DAI ERC20',
      abi: '[{"inputs":[{"internalType":"address","name":"implementationContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}]',
      specifyBlock: false,
    },
    {
      id: 'xx3',
      chainId: ChainId.Arbitrum,
      isUseWallet: false,
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      name: 'USDC ERC20',
      abi: '[{"inputs":[{"internalType":"address","name":"implementationContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}]',
      specifyBlock: false,
    },
    {
      id: 'xx4',
      chainId: ChainId.Arbitrum,
      isUseWallet: false,
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      name: 'DAI ERC20',
      abi: '[{"inputs":[{"internalType":"address","name":"implementationContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}]',
      specifyBlock: false,
    },
  ]

  const groupByChainId = useMemo(() => {
    return MockData.reduce(
      (acc, item) => {
        if (!acc[item.chainId]) {
          acc[item.chainId] = []
        }
        acc[item.chainId].push(item)
        return acc
      },
      {} as Record<number, ContractParams[]>
    )
  }, [MockData])

  return (
    <>
      <ScrollArea className="h-[620px] w-full">
        <Accordion type="multiple">
          {Object.entries(groupByChainId).map(([chainId, items]) => (
            <GroupItem key={chainId} chainId={Number(chainId)} items={items}></GroupItem>
          ))}
        </Accordion>
      </ScrollArea>
    </>
  )
}
