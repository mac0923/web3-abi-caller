import { mainnet, arbitrum, bsc, optimism, avalanche } from 'viem/chains'

export enum ChainId {
  Mainnet = mainnet.id,
  Arbitrum = arbitrum.id,
  Bsc = bsc.id,
  Optimism = optimism.id,
  Avalanche = avalanche.id,
}

export const SUPPORTED_CHAINS = [
  ChainId.Mainnet,
  ChainId.Arbitrum,
  ChainId.Bsc,
  ChainId.Optimism,
  ChainId.Avalanche,
]

export const ChainConfigs = {
  [ChainId.Mainnet]: mainnet,
  [ChainId.Arbitrum]: arbitrum,
  [ChainId.Bsc]: bsc,
  [ChainId.Optimism]: optimism,
  [ChainId.Avalanche]: avalanche,
}
