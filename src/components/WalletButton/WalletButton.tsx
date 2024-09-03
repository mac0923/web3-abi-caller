import { t } from '@lingui/macro'
import { useMemo } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useCopyToClipboard } from 'react-use'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ellipsisMiddle } from '@/utils'

export default function WalletButton() {
  const { connectors, connect } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [, copyValue] = useCopyToClipboard()

  const injectedConnector = useMemo(() => {
    return connectors.find(connector => connector.name === 'Injected')
  }, [connectors])

  async function connectWallet() {
    if (!injectedConnector) {
      return
    }
    connect({ connector: injectedConnector })
  }

  return (
    <>
      {!isConnected ? (
        <Button
          className="bg-sky-600 text-white hover:bg-sky-500 h-[30px] text-[13px] pl-[8px] pr-[8px] pt-[4px] pb-[4px]"
          onClick={connectWallet}
        >{t`Connect Wallet`}</Button>
      ) : undefined}
      {isConnected && address ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <div className="rounded-[24px] pt-[2px] pb-[2px] pl-[12px] pr-[12px] text-[14px] border-slate-300 border-[1px] hover:text-sky-300">
              {ellipsisMiddle(address)}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => disconnect()}
            >{t`Disconnect`}</DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => copyValue(address)}
            >{t`Copy`}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : undefined}
    </>
  )
}
