import { type Config, getClient, getConnectorClient } from '@wagmi/core'
import { FallbackProvider, BrowserProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers'
import type { Account, Client, Chain, Transport } from 'viem'

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }
  return new JsonRpcProvider(transport.url, network)
}

export function getEthersProvider(config: Config, { chainId }: { chainId?: number } = {}) {
  const client = getClient(config, { chainId })
  if (!client) return
  return clientToProvider(client)
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

export async function getEthersSigner(config: Config, { chainId }: { chainId?: number } = {}) {
  const client = await getConnectorClient(config, { chainId })
  return clientToSigner(client)
}
