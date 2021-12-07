import { useERC20, useSheepStake, useToken } from './useContract'
import { useState, useCallback } from 'react'
import { useWeb3 } from '../hooks/useWeb3'
import BigNumber from 'bignumber.js'
import { ZERO_ADDRESS } from '../constants/constants'
import { STATE } from '../constants/enums'
import TokenFarm_ABI from '../assets/abis/SheepFarm.json'
import CoinToken from '../assets/abis/DappToken.json'

export const ZERO_BALANCE = new BigNumber(0)
const sheepAddress = '0x98F913f216C58DE3CC5b7f470ec09ce7b1E81082'
const TokenFarmContract = '0x619F504379723E757073E70D1D678FB051c47Bdb'

export const useERC20Approval = (requiredApprovedBalance) => {
  const contractCoinToken = useToken(sheepAddress, CoinToken.abi)
  const ContractFarm = useSheepStake(TokenFarmContract, TokenFarm_ABI.abi)

  const toApprove = TokenFarmContract

  const [approvedBalance, setApprovedBalance] = useState(ZERO_BALANCE)
  const [approveState, setApproveState] = useState(STATE.IDLE)
  const [isApproved, setIsApproved] = useState(false)

  const { account } = useWeb3()
  const token = useERC20(sheepAddress, CoinToken.abi)

  const fetchApprovedBalance = useCallback(async () => {
    if (sheepAddress === ZERO_ADDRESS) {
      setIsApproved(true)
      return
    }
    try {
      const bal = await token.methods.allowance(account, toApprove).call()
      const approveBal = new BigNumber(bal)
      setApprovedBalance(approveBal)
      setIsApproved(
        approveBal.gte(
          new BigNumber(requiredApprovedBalance ? requiredApprovedBalance : 1),
        ),
      )
    } catch (e) {
      console.log(e)
    }
  }, [account, token, toApprove, requiredApprovedBalance])

  const approve = async (amount) => {
    try {
      setApproveState(STATE.BUSY)
      contractCoinToken.options.address = sheepAddress
      ContractFarm.options.address = TokenFarmContract

      await contractCoinToken.methods
        .approve(TokenFarmContract, amount)
        .send({ from: account })
        .on('transactionHash', (hash) => {})

      await ContractFarm.methods
        .stakeTokens(amount)
        .send({ from: account })
        .on('transactionHash', (hash) => {})

      await fetchApprovedBalance()

      setApproveState(STATE.SUCCEED)
    } catch (e) {
      console.log(e)
      setApproveState(STATE.FAILED)
    }
  }

  const unstake = async () => {
    try {
      setApproveState(STATE.BUSY)

      ContractFarm.options.address = TokenFarmContract

      await ContractFarm.methods
        .unstakeTokens()
        .send({ from: account })
        .on('transactionHash', (hash) => {})

      await fetchApprovedBalance()

      setApproveState(STATE.SUCCEED)
    } catch (e) {
      console.log(e)
      setApproveState(STATE.FAILED)
    }
  }

  const claim = async () => {
    try {
      setApproveState(STATE.BUSY)

      ContractFarm.options.address = TokenFarmContract

      await ContractFarm.methods
        .claim()
        .send({ from: account })
        .on('transactionHash', (hash) => {})

      await fetchApprovedBalance()

      setApproveState(STATE.SUCCEED)
    } catch (e) {
      console.log(e)
      setApproveState(STATE.FAILED)
    }
  }

  const Rewards = async () => {
    try {
      setApproveState(STATE.BUSY)

      ContractFarm.options.address = TokenFarmContract

      await ContractFarm.methods
        .issueTokens()
        .send({ from: account })
        .on('transactionHash', (hash) => {})

      await fetchApprovedBalance()

      setApproveState(STATE.SUCCEED)
    } catch (e) {
      console.log(e)
      setApproveState(STATE.FAILED)
    }
  }

  return {
    approvedBalance,
    isApproved,
    approveState,
    approve,
    unstake,
    claim,
    Rewards,
  }
}
