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
const farmAddress = '0x3260DCeB1886E123C17444Eab8ACE44B96eCbf2B'

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

export const useStakeToRewards = (address, decimals = '18') => {
  const contract = useSheepStake(farmAddress, TOKENFARM_ABI.abi)
  //States Variables
  const [_stakingBalance, set_stakingBalance] = useState(undefined)
  const [_percentualRewards, set_percentualRewards] = useState(undefined)
  const [_rewardsDividend, set_rewardsDividend] = useState(undefined)
  //return value
  const [_rewards, set_rewards] = useState(undefined)
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3()
  //Value Captured to Blockchain
  useEffect(() => {
    const fetch = async () => {
      contract.options.address = farmAddress
      const stakingBalance = await contract.methods
        .stakingBalance(account)
        .call()
      const percentualRewards = await contract.methods
        .PercentualRewardsValue()
        .call()
      const rewardsDividend = await contract.methods
        .rewardsDividendsValue()
        .call()

      set_stakingBalance(new BigNumber(stakingBalance))
      set_percentualRewards(new BigNumber(percentualRewards))
      set_rewardsDividend(new BigNumber(rewardsDividend))

      const blockchainStakingvalue = toLower(
        stakingBalance,
        decimals,
      ).toNumber()
      const blockchainPercentualRewards = toLower(
        percentualRewards,
        decimals,
      ).toNumber()
      const blockchainRewardsDividends = toLower(
        rewardsDividend,
        decimals,
      ).toNumber()

      const valueToRewards =
        (((blockchainStakingvalue * 10 ** 9) / 100) *
          blockchainPercentualRewards) /
        blockchainRewardsDividends
      set_rewards(valueToRewards)
    }
    if (contract) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, fastRefresh])

  return { _stakingBalance, _percentualRewards, _rewardsDividend, _rewards }
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

export const useDateRewards = (address, decimals = '9') => {
  const contract = useSheepStake(farmAddress, DAPP_TOKEN_ABI.abi)
  const [date, setDate] = useState(undefined)
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3()

  useEffect(() => {
    const fetch = async () => {
      contract.options.address = farmAddress
      const date = await contract.methods.getClaimUnlockTime(account).call()
      var dateTime = new Date(date * 1000)

      var result = dateTime.toLocaleDateString('en-US').toString()

      setDate(result)
    }
    if (contract) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, fastRefresh])

  return { date }
}
