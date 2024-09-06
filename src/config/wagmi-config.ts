import { http, createConfig } from 'wagmi'
import { mainnet, arbitrum, bsc, optimism, avalanche } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, bsc, optimism, avalanche],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [bsc.id]: http(),
    [optimism.id]: http(),
    [avalanche.id]: http(),
  },
})
