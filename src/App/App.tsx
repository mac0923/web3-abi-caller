import { ReactElement } from 'react'
import { HashRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.scss'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider'
import { wagmiConfig } from '@/config/wagmi-config'
import FullRouter from '@/router/FullRouter'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { useI18nLocalStorage } from '@/lib/i18n'

function FullApp({ children }: { children: ReactElement }) {
  return (
    <>
      <div className="flex h-screen flex-col bg-background">
        <Header></Header>
        <div className="flex-grow overflow-y-auto">{children}</div>
        <Footer></Footer>
      </div>
    </>
  )
}

const queryClient = new QueryClient()

function App() {
  useI18nLocalStorage()

  return (
    <>
      <I18nProvider i18n={i18n}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark">
              <FullApp>
                <HashRouter>
                  <FullRouter></FullRouter>
                </HashRouter>
              </FullApp>
              <Toaster />
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </I18nProvider>
    </>
  )
}

export default App
