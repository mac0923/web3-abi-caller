import { ReactElement } from 'react'
import { HashRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'

import './App.scss'
import { wagmiConfig } from '@/config/wagmi-config'
import FullRouter from '@/router/FullRouter'
import { useI18nLocalStorage } from '@/libs/i18n'

function FullApp({ children }: { children: ReactElement }) {
  return (
    <>
      <div className="Container">{children}</div>
    </>
  )
}

function App() {
  useI18nLocalStorage()

  return (
    <>
      <I18nProvider i18n={i18n}>
        <WagmiProvider config={wagmiConfig}>
          <FullApp>
            <HashRouter>
              <FullRouter></FullRouter>
            </HashRouter>
          </FullApp>
        </WagmiProvider>
      </I18nProvider>
    </>
  )
}

export default App
