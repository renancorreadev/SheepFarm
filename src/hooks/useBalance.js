import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { toLower } from '../utils/utils'
import { useUSDT, useSheepStake } from './useContract'
import { useRefresh } from './useRefresh'
import { useWeb3 } from './useWeb3'
import DAPP_TOKEN_ABI from '../assets/abis/DappToken.json'
import DAITOKEN_ABI from '../assets/abis/DaiToken.json'
import TOKENFARM_ABI from '../assets/abis/SheepFarm.json'

const sheepAddress = '0x0025B42bfc22CbbA6c02d23d4Ec2aBFcf6E014d4'
const usdtAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
const farmAddress = '0x594F955070554fEfA4637BBa8A0C687BD7Fd1dFE'

export const useSheepBalance = (address, decimals = '9') => {
  const contract = useUSDT(sheepAddress, DAPP_TOKEN_ABI.abi)
  const [balance, setBalance] = useState(undefined)
  const [sheepBalance, setSheepBalance] = useState(undefined)
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3()

  useEffect(() => {
    const fetch = async () => {
      contract.options.address = sheepAddress
      const bal = await contract.methods.balanceOf(account).call()
      setBalance(new BigNumber(bal))
      const val = toLower(bal, decimals).toNumber()

      const value = val.toFixed(0)
      let dollarUSLocale = Intl.NumberFormat('en-US')
      const amount = dollarUSLocale.format(value)
      setSheepBalance(amount)
    }
    if (contract) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, fastRefresh])

  return { balance, sheepBalance }
}
//DAI TOKEN = USD
export const useUSDTbalance = (address, decimals = '18') => {
  const contract = useUSDT(usdtAddress, DAITOKEN_ABI.abi)
  const [balance, setBalance] = useState(undefined)
  const [usdBalance, setUsdBalance] = useState(undefined)
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3()

  useEffect(() => {
    const fetch = async () => {
      contract.options.address = usdtAddress
      const bal = await contract.methods.balanceOf(account).call()
      setBalance(new BigNumber(bal))
      const val = toLower(bal, decimals).toNumber()
      const value = val.toFixed(0)
      let dollarUSLocale = Intl.NumberFormat('en-US')
      const amount = dollarUSLocale.format(value)
      setUsdBalance(amount)
    }
    if (contract) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, fastRefresh])

  return { balance, usdBalance }
}

export const useStakeBalance = (address, decimals = '9') => {
  const contract = useSheepStake(farmAddress, TOKENFARM_ABI.abi)
  const [balance, setBalance] = useState(undefined)
  const [stakeBalance, setStakeBalance] = useState(undefined)

  const { fastRefresh } = useRefresh()

  const { account } = useWeb3()

  useEffect(() => {
    const fetch = async () => {
      contract.options.address = farmAddress
      const bal = await contract.methods.stakingBalance(account).call()
      setBalance(new BigNumber(bal))
      const val = toLower(bal, decimals).toNumber()
      const value = val.toFixed(0)
      let dollarUSLocale = Intl.NumberFormat('en-US')
      const amount = dollarUSLocale.format(value)
      setStakeBalance(amount)
    }
    if (contract) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, fastRefresh])

  return { balance, stakeBalance }
}

export const useLockRewards = (address, decimals = '9') => {
  const contract = useSheepStake(farmAddress, DAPP_TOKEN_ABI.abi)
  const [lock, setLock] = useState(undefined)
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetch = async () => {
      contract.options.address = farmAddress
      const isLock = await contract.methods.lockClaim().call()
      setLock(isLock)
    }
    if (contract) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, fastRefresh])

  return { lock }
}

export const useClaim = (address, decimals = '9') => {
  const contract = useSheepStake(farmAddress, DAPP_TOKEN_ABI.abi)
  const contractBUSD = useUSDT(usdtAddress, DAITOKEN_ABI.abi)
  const { stakeBalance } = useStakeBalance()
  const { account } = useWeb3()

  const claimNow = async () => {
    contract.options.address = farmAddress
    //Calculate the amount of tokens to claim
    // const percentual = await contract.methods.percentualRewards().call()
    // const rewardsDividend = await contract.methods.rewardsDividend().call()
    const amount = ((stakeBalance / 100) * 25) / 10000
    //Claim the tokens
    const amountBG = new BigNumber(amount)
    contractBUSD.options.address = usdtAddress
    try {
      await contractBUSD.methods
        .transferFrom(farmAddress, account, amountBG)
        .send()
    } catch (e) {
      console.log(e)
    }
  }
  return { claimNow }
}
