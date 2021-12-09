import { React } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import { useForm } from 'react-hook-form'
import { useEagerConnect, useERC20Approval } from '../../main/index'

const FormUnstake = () => {
  useEagerConnect()
  const { unstake } = useERC20Approval()
  const { handleSubmit } = useForm()

  const onSubmit = (data) => {
    unstake()
  }

  return (
    <form className="form-stake" onSubmit={handleSubmit(onSubmit)}>
      <div className="boxstake row">
        <div className="unstake col-md-12">
          <button
            className="btn btn-primary btn-block btn-lg"
            variant="outlined"
          >
            UnStake
          </button>
        </div>
      </div>
    </form>
  )
}

export default FormUnstake
