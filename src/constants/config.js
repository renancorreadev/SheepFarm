import BigNumber from 'bignumber.js/bignumber'
import { connectorNames } from '../hooks/useConnectors'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const config = {
  defaultConnector: connectorNames.injected,
  chainId: 56,
  bsc: true,
  darkMode: false,
  orange: {
    address: '0xc362Db5548Ea3eB729B0f5530eEd3415A338f7Be',
    symbol: 'SHEEP',
  },
  wrappedNative: {
    address: '',
    symbol: '',
  },
  usd: {
    address: '',
    symbol: '',
  },
  nativeUsdLp: {
    address: '',
    symbol: '',
  },
  rpcUrls: {
    56: 'https://bsc-dataseed.binance.org/',
  },
  walletConnectPoolingInterval: 12000,
  supportedChainIds: [56],
  unsupportedChainSetup: {
    97: {
      chainId: `0x61`,
      chainName: 'Binance Smart Chain Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'bnb',
        decimals: 18,
      },
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      blockExplorerUrls: ['https://testnet.bscscan.com'],
    },
  },
}

export default config
