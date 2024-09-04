import { ContractParams } from '@/types'
import { encodeContractId } from '@/utils/contract'
import { ChainId } from './chain'

export const DefaultContract: ContractParams = {
  id: encodeContractId(ChainId.Mainnet.toString(), '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
  chainId: ChainId.Mainnet,
  isUseWallet: false,
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  name: 'USDC Token',
  abi: `[{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]`,
  specifyBlock: false,
}
