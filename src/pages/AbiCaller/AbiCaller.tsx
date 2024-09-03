import './AbiCaller.scss'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import AddContractButton from '@/components/AddContractButton/AddContractButton'
import ContractList from '@/components/ContractList/ContractList'
import ContractPanel from '@/components/ContractPanel/ContractPanel'
import { ContractProvider } from '@/context/ContractContext'

export default function AbiCallerPage() {
  return (
    <>
      <ContractProvider>
        <div className="abi-caller w-[86%] rounded-[12px] border p-[14px]">
          <div className="font-semibold text-[22px] flex items-center justify-center mb-[14px]">
            Abi Caller
          </div>
          <div className="w-full border rounded-[4px]">
            <ResizablePanelGroup direction="horizontal" className="!h-[680px]">
              <ResizablePanel minSize={12} maxSize={32} defaultSize={14}>
                <div className="m-[12px] flex items-center justify-center">
                  <AddContractButton></AddContractButton>
                </div>
                <div className="border-t">
                  <ContractList></ContractList>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <ContractPanel></ContractPanel>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </ContractProvider>
    </>
  )
}
