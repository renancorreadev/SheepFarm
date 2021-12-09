import { React } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import { useForm } from 'react-hook-form'
import { useEagerConnect, useERC20Approval } from '../../main/index'

const FormClaim = () => {
  useEagerConnect()

  const { claim } = useERC20Approval()

  const { handleSubmit } = useForm()

  const onSubmit = () => {
    claim()
  }
  return (
    <form
      style={{ position: 'relative', marginTop: '36px' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="boxstake row">
        <div className="unstake col-md-12">
          <button
            className="btn btn-primary btn-block btn-lg"
            variant="outlined"
          >
            Claim
          </button>
        </div>
      </div>
    </form>
  )
}

export default FormClaim
