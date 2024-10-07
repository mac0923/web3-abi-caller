import { useContext, useMemo } from 'react'
import { LayersIcon, FileTextIcon } from '@radix-ui/react-icons'
import { ChainConfigs } from '@/config/chain'
import { ContractParams } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ContractContext } from '@/context/ContractContext'

function GroupItem({ chainId, items }: { chainId: number; items: ContractParams[] }) {
  const { updateSelectedContractId, selectedContractId } = useContext(ContractContext)

  const chainConfig = useMemo(() => {
    return ChainConfigs[chainId]
  }, [chainId])

  return (
    <>
      <AccordionItem value={chainConfig.id.toString()}>
        <AccordionTrigger className="pl-[8px] pr-[8px]">
          <div className="flex items-center">
            <LayersIcon className="mr-[8px]"></LayersIcon>
            {chainConfig.name}
          </div>
        </AccordionTrigger>
        <AccordionContent className="!pb-0 cursor-pointer">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => updateSelectedContractId(item.id)}
              className="h-[52px] border-t flex items-center pl-[16px]"
            >
              <FileTextIcon className="mr-[4px]"></FileTextIcon>
              <div
                className={`hover:underline ${selectedContractId === item.id ? 'underline' : ''}`}
              >
                {item.name}
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </>
  )
}

export default function ContractList() {
  const { contracts, selectedContract } = useContext(ContractContext)

  const groupByChainId = useMemo(() => {
    return contracts.reduce(
      (acc, item) => {
        if (!acc[item.chainId]) {
          acc[item.chainId] = []
        }
        acc[item.chainId].push(item)
        return acc
      },
      {} as Record<number, ContractParams[]>
    )
  }, [contracts])

  return (
    <>
      <ScrollArea className="h-[620px] w-full">
        <Accordion
          type="multiple"
          defaultValue={selectedContract ? [selectedContract?.chainId.toString()] : undefined}
        >
          {Object.entries(groupByChainId).map(([chainId, items]) => (
            <GroupItem key={chainId} chainId={Number(chainId)} items={items}></GroupItem>
          ))}
        </Accordion>
      </ScrollArea>
    </>
  )
}
