import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { loanAppGroupDataActions } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

const { goodMonthEarnings } = loanAppGroupDataActions

export const getGoodMonthEarnings = (id: string) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(goodMonthEarnings.getGoodMonthEarningsRequest())
  try {
    const response = await axios.get(
      `/ApplicationGroupData/GoodMonthEarnings/${id}`
    )
    dispatch(goodMonthEarnings.getGoodMonthEarningsSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(goodMonthEarnings.getGoodMonthEarningsFail(resData))
    return Promise.reject(resData)
  }
}
