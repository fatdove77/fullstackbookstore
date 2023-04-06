import { InjectedConnector } from '@web3-react/injected-connector'
import {NETWORK} from './netConfig'
export const injected = new InjectedConnector({
  supportedChainIds: [1,NETWORK.chainId,12306],  //里面添加要链接的chainId和chainId的十六进制
})
