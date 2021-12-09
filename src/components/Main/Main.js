import { React } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import './style.css'
import sheepDam from '../../assets/sheep-token.png'
import rewardpng from '../../assets/icons/rewards.png'
import usdLogo from '../../assets/usd.png'
import FormStake from '../Forms/FormStake'
import About from '../About/index'
import Works from '../../components/HowWorks/index'
import MainCarousel from '../../components/MainCarousel/index'
import StakeNow from '../../components/StakeNow/index'
import FormClaim from '../Forms/FormClaim'
import FormUnstake from '..//Forms/FormUnstake'
import {
  useEagerConnect,
  useWeb3,
  useUSDTbalance,
  useStakeBalance,
  useSheepBalance,
  useStakeToRewards,
  useDateRewards,
} from '../../main/index'
import BoxPage from '../BoxPage/BoxPage'
import BoxPageEnd from '../BoxPage/BoxPageEnd'
import BoxPageMid from '../BoxPage/BoxPageMid'

const Main = () => {
  useEagerConnect()
  const { account, connected } = useWeb3()
  const { usdBalance } = useUSDTbalance(account)
  const { stakeBalance } = useStakeBalance(account)
  const { sheepBalance } = useSheepBalance(account)
  const { _rewards } = useStakeToRewards(account)
  const { date } = useDateRewards(account)

  return (
    <>
      <span className=" container-fluid ">
        {connected ? (
          <Container className="TextBorder">
            {' '}
            <Container>
              <div className="row">
                <div className="col-md-12">
                  <h2 className="title-main d-flex justify-content-center ">
                    Sheep USD Staker
                  </h2>
                </div>
              </div>
            </Container>
            <Container>
              <div
                className="row "
                style={{
                  backgroundColor: '#5dcea3',
                  paddingBottom: '17px',
                  borderRadius: '20px',
                }}
              >
                <div className=" col-md-6">
                  <h2 className="AmountSheep d-flex justify-content-center">
                    <img
                      src={usdLogo}
                      alt="Rewards"
                      style={{
                        width: '40px',
                        height: 'auto',
                        marginRight: '10px',
                      }}
                    />
                    : {usdBalance}
                  </h2>
                </div>
                <div
                  className="col-md-6"
                  style={{
                    marginBottom: '20px',
                    paddingBottom: '2px',
                  }}
                >
                  <h2 className="AmountSheep d-flex justify-content-center">
                    <img
                      src={sheepDam}
                      alt="Rewards"
                      style={{
                        width: '40px',
                        height: 'auto',
                        marginRight: '10px',
                      }}
                    />
                    : {sheepBalance}
                  </h2>
                </div>
              </div>
            </Container>
            <Container>
              <div className="row" style={{ marginBottom: '230px' }}>
                <div className="col-md-6 box">
                  <div className="row">
                    <div className="col-md-12">
                      <h2 className="AmountSheep">
                        <img
                          src={sheepDam}
                          alt="UsdBalance"
                          className="UsdDawm"
                        />
                        Sheep's in Staking:{' '}
                        <span className="stakeBalance">{stakeBalance}</span>
                      </h2>
                    </div>
                  </div>
                  <div className="row">
                    <div className="formStake col-md-12 d-flex justify-content-center">
                      <FormStake />
                    </div>
                    <div className="row">
                      <div className="col-md-12 d-flex justify-content-center">
                        <FormUnstake />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="claimBox col-md-6 box2">
                  <h2 className="AmountSheep">
                    <img src={rewardpng} alt="UsdBalance" className="UsdDawm" />
                    Rewards to Claim: {_rewards}
                  </h2>
                  <div className="row">
                    <div className="col-md-12 d-flex justify-content-center">
                      <FormClaim />
                    </div>
                  </div>
                  <div
                    className="row"
                    style={{
                      backgroundColor: 'white',
                      padding: '15px',
                      borderRadius: '20px',
                      marginTop: '20px',
                    }}
                  >
                    <div
                      className="col-md-6 d-flex justify-content-end"
                      style={{ marginBottom: '20px' }}
                    >
                      <h3 style={{ position: 'relative', top: '20px' }}>
                        Next Date to claim:{' '}
                      </h3>
                    </div>
                    <div
                      className="col-md-6 d-flex justify-content-start"
                      style={{ marginBottom: '10px' }}
                    >
                      <h4
                        style={{
                          position: 'relative',
                          top: '15px',
                          backgroundColor: '#078f5b',
                          padding: '10px',
                          borderRadius: '20px',
                        }}
                      >
                        {date === '12/31/1969' ? (
                          <span style={{ color: 'white', fontSize: '20px' }}>
                            you didn't make a claim
                          </span>
                        ) : (
                          <span style={{ color: 'white' }}>{date}</span>
                        )}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>{' '}
            </Container>
          </Container>
        ) : (
          <>
            <div className="carousel-container container-fluid p-0">
              <MainCarousel />
            </div>

            <div className="container">
              <div className="row">
                <div className="col-md-4 ">
                  <BoxPage />
                </div>
                <div className="col-md-4 ">
                  <BoxPageMid />
                </div>
                <div className="col-md-4 ">
                  <BoxPageEnd />
                </div>
              </div>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-md-12 ">
                  <h2
                    id="How_works"
                    className="TITLE d-flex justify-content-center"
                  >
                    How Works
                  </h2>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 ">
                  <Works />
                </div>
              </div>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-md-12 ">
                  <h2
                    id="about"
                    className="TITLE d-flex justify-content-center"
                  >
                    About
                  </h2>
                </div>
              </div>

              <div className="row">
                <About />
              </div>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-md-12 ">
                  <h2
                    id="stake_now"
                    className="TITLE d-flex justify-content-center"
                  >
                    Stake Now
                  </h2>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 ">
                  <StakeNow />
                </div>
              </div>
            </div>
          </>
        )}
      </span>{' '}
    </>
  )
}

export default Main
