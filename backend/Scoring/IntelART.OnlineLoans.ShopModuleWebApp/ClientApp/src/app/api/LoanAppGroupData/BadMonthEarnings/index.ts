import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { loanAppGroupDataActions } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

const { badMonthEarnings } = loanAppGroupDataActions

export const getBadMonthEarnings = (id: string) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(badMonthEarnings.getBadMonthEarningsRequest())
  try {
    const response = await axios.get(
      `/ApplicationGroupData/BadMonthEarnings/${id}`
    )
    dispatch(badMonthEarnings.getBadMonthEarningsSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(badMonthEarnings.getBadMonthEarningsFail(resData))
    return Promise.reject(resData)
  }
}
