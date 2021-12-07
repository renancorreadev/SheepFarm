import { React } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import { useForm } from 'react-hook-form'
import { useEagerConnect, useClaim } from '../../main/index'

const FormClaim = () => {
  useEagerConnect()

  const { claimNow } = useClaim()

  const { handleSubmit } = useForm()

  const onSubmit = () => {
    claimNow()
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
