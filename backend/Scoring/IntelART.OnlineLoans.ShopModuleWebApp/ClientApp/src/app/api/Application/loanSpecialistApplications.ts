import { AnyAction, Dispatch } from 'redux'

import { ILoanSpecApplicationData } from '@store/reducers/loanSpecApplication/models'
import { Utils } from 'app/services/utils'
import { loanSpecApplicationActions as actions } from '@store/reducers/root-actions'
import axios from 'app/api'
import { toast } from 'react-toastify'

export const getLoanSpecApplication = (id: string) => async (
  dispatch: Dispatch<AnyAction>,
  getState: any
) => {
  dispatch(actions.getLoanSpecApplicationRequest())
  try {
    const response = await axios.get(`/Applications/${id}/LoanSpecialist`)
    dispatch(actions.getLoanSpecApplicationSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(actions.getLoanSpecApplicationFail(resData))
    return Promise.reject(resData)
  }
}

export const saveLoanSpecApplication = (
  id: string,
  data: ILoanSpecApplicationData
) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(actions.postLoanSpecApplicationRequrest())
  try {
    const response = await axios.post(
      `/Applications/${id}/LoanSpecialist`,
      data
    )
    dispatch(actions.postLoanSpecApplicationSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(actions.postLoanSpecApplicationFail())
    return Promise.reject(resData)
  }
}
