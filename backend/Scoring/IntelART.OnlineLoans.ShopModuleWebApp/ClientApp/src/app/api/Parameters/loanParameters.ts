import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { loanParamsAction } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

export const getLoanParameters = (loanTypeCode: string) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(loanParamsAction.getLoanParametersRequest())
  try {
    const response = await axios.get(`/Parameters`, {
      params: { loanTypeCode },
    })
    dispatch(loanParamsAction.getLoanParametersSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(loanParamsAction.getLoanParametersFetchFail(resData))
    return Promise.reject(resData)
  }
}
