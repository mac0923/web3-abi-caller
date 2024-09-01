import './Header.scss'
import WalletButton from '../WalletButton/WalletButton'
import LogoSvg from '@/assets/logo.svg'
import LocalesButton from '../LocalesButton/LocalesButton'

export default function Header() {
  return (
    <>
      <div className="header relative h-[64px] flex items-center border-b">
        <div className="flex items-center">
          <img className="h-[24px] w-[24px]" src={LogoSvg} alt="" />
          <span className="ml-[6px] hidden font-bold lg:inline-block">Abi Caller</span>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div>
            <LocalesButton></LocalesButton>
          </div>
          <div className="ml-[4px]">
            <WalletButton></WalletButton>
          </div>
        </div>
      </div>
    </>
  )
}
