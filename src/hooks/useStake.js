import { useToken, useERC20, useSheepStake } from './useContract'
import { useState, useEffect } from 'react'
import { useWeb3 } from '../hooks/useWeb3'
import BigNumber from 'bignumber.js'
import { ZERO_ADDRESS, MAX_UINT } from '../constants/constants'
import { STATE } from '../constants/enums'
import DAPPTOKEN_ABI from '../assets/abis/DappToken.json'
import TOKENFARM_ABI from '../assets/abis/TokenFarm.json'

export const ZERO_BALANCE = new BigNumber(0)

export const useSheepStake = (SheepAddress, amount) => {
  const [amount, setAmount] = useState(undefined)
  const sheepAddress = '0x0025B42bfc22CbbA6c02d23d4Ec2aBFcf6E014d4'
  const TokenTokenFarmContract = '0x594F955070554fEfA4637BBa8A0C687BD7Fd1dFE'
  const [stakedBalance, setStakedBalance] = useState(ZERO_BALANCE)
  const [stakeState, setStakeState] = useState(STATE.IDLE)
  const [isStaked, setIsStaked] = useState(false)

  const { account, connected } = useWeb3()
  const Disconnect = connected === false
  const TokenFarmContract = useSheepStake(TokenTokenFarmContract, TOKENFARM_ABI)
  const SheepTokenContract = useToken(sheepAddress, DAPPTOKEN_ABI.abi)

  const fetchStakeBalance = async () => {
    if (TokenFarmContract === ZERO_ADDRESS) {
      setIsStaked(true)
      return
    }
    try {
      const bal = await SheepTokenContract.methods
        .allowance(account, toApprove)
        .call()
      const approveStake = new BigNumber(bal)
      setStakedBalance(approveStake)
      setIsStaked(
        approveStake.gte(
          new BigNumber(requiredApprovedBalance ? requiredApprovedBalance : 1),
        ),
      )
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    if (account && TokenFarmContract) {
      fetchStakeBalance()
    }
  }, [account, TokenFarmContract])

  const stake = async () => {
    try {
      setStakeState(STATE.BUSY)
      TokenFarmContract.options.address =
        '0x594F955070554fEfA4637BBa8A0C687BD7Fd1dFE'

      await TokenFarmContract.methods
        .stakeTokens(amount)
        .send({ from: account })
        .on('transactionHash', (hash) => {
          Disconnect
        })
      await fetchStakeBalance()

      setStakeState(STATE.SUCCEED)
    } catch (e) {
      console.log(e)
      setStakeState(STATE.FAILED)
    }
  }

  return { stakedBalance, isStaked, stakeState, stake }
}
