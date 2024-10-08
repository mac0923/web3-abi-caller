import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import {
  mainnet,
  arbitrum,
  bsc,
  optimism,
  avalanche,
  arbitrumNova,
  arbitrumGoerli,
  avalancheFuji,
  base,
  blast,
  celo,
  goerli,
  hardhat,
  linea,
  merlin,
  okc,
  opBNB,
  polygon,
  polygonZkEvm,
  scroll,
  zksync,
  fantom,
} from 'viem/chains'

export const wagmiConfig = createConfig({
  chains: [
    mainnet,
    arbitrum,
    bsc,
    optimism,
    avalanche,
    arbitrumNova,
    arbitrumGoerli,
    avalancheFuji,
    base,
    blast,
    celo,
    goerli,
    hardhat,
    linea,
    merlin,
    okc,
    opBNB,
    polygon,
    polygonZkEvm,
    scroll,
    zksync,
    fantom,
  ],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [bsc.id]: http(),
    [optimism.id]: http(),
    [avalanche.id]: http(),
    [arbitrumNova.id]: http(),
    [arbitrumGoerli.id]: http(),
    [avalancheFuji.id]: http(),
    [base.id]: http(),
    [blast.id]: http(),
    [celo.id]: http(),
    [hardhat.id]: http(),
    [linea.id]: http(),
    [merlin.id]: http(),
    [okc.id]: http(),
    [opBNB.id]: http(),
    [polygon.id]: http(),
    [polygonZkEvm.id]: http(),
    [scroll.id]: http(),
    [zksync.id]: http(),
    [fantom.id]: http(),
    [goerli.id]: http(),
  },
})
