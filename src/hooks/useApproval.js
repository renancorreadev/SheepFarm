import { useERC20, useSheepStake, useToken } from './useContract'
import { useState, useCallback } from 'react'
import { useWeb3 } from '../hooks/useWeb3'
import BigNumber from 'bignumber.js'
import { ZERO_ADDRESS } from '../constants/constants'
import { STATE } from '../constants/enums'
import TokenFarm_ABI from '../assets/abis/SheepFarm.json'
import CoinToken from '../assets/abis/DappToken.json'

export const ZERO_BALANCE = new BigNumber(0)
const sheepAddress = '0x0025B42bfc22CbbA6c02d23d4Ec2aBFcf6E014d4'
const farmAddress = '0x594F955070554fEfA4637BBa8A0C687BD7Fd1dFE'

export const useERC20Approval = (requiredApprovedBalance) => {
  const contractCoinToken = useToken(sheepAddress, CoinToken.abi)
  const ContractFarm = useSheepStake(farmAddress, TokenFarm_ABI.abi)

  const toApprove = farmAddress

  const [approvedBalance, setApprovedBalance] = useState(ZERO_BALANCE)
  const [approveState, setApproveState] = useState(STATE.IDLE)
  const [isApproved, setIsApproved] = useState(false)
  //Cla
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
      ContractFarm.options.address = farmAddress

      await contractCoinToken.methods
        .approve(farmAddress, amount)
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

      ContractFarm.options.address = farmAddress

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

  const Rewards = async () => {
    try {
      setApproveState(STATE.BUSY)

      ContractFarm.options.address = farmAddress

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
    Rewards,
  }
}
