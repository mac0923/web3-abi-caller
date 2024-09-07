import { t } from '@lingui/macro'
import { useContext, useMemo, useState } from 'react'
import { isAddress } from 'viem'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChainConfigs, ChainId, SUPPORTED_CHAINS } from '@/config/chain'
import { isJsonArray } from '@/utils'
import { ContractContext } from '@/context/ContractContext'
import { encodeContractId } from '@/utils/contract'

export default function AddContractButton() {
  const { addContract } = useContext(ContractContext)

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

  function resetInputValue() {
    setName('')
    setChain(ChainId.Mainnet.toString())
    setAddress('')
    setAbi('')
  }

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

  function updateDialogState(v: boolean) {
    setShowDialog(v)
    resetInputValue()
  }

  function onConfirm() {
    const id = encodeContractId(chain, address)
    addContract(
      {
        id: id,
        chainId: Number(chain),
        isUseWallet: false,
        address: address,
        name: name,
        abi: abi,
        specifyBlock: false,
      },
      true
    )
    setShowDialog(false)
  }

  return (
    <Dialog open={showDialog} onOpenChange={v => updateDialogState(v)}>
      <DialogTrigger asChild>
        <Button variant="outline">{t`Add Contract`}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t`Add Contract`}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center mb-[16px] mt-[24px]">
              <div className="w-[68px]">{t`Name`}</div>
              <div className="w-[calc(100%-68px)]">
                <Input
                  className="text-slate-50"
                  value={name}
                  onInput={updateName}
                  placeholder={t`Name`}
                />
              </div>
            </div>
            <div className="flex items-center mb-[16px]">
              <div className="w-[68px]">{t`Chain`}</div>
              <div className="w-[calc(100%-68px)]">
                <Select defaultValue={chain} onValueChange={(v: string) => setChain(v)}>
                  <SelectTrigger className="w-[100%] text-slate-50">
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
                <Input
                  className="text-slate-50"
                  value={address}
                  onInput={updateAddress}
                  placeholder={t`Contract`}
                />
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-[68px]">{t`Abi`}</div>
              <div className="w-[calc(100%-68px)]">
                <Textarea
                  value={abi}
                  onInput={updateAbi}
                  className="h-[120px] text-slate-50"
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
