import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { loanAppGroupDataActions } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

const { balances } = loanAppGroupDataActions

export const getBalances = (id: string) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(balances.getBalancesRequest())
  try {
    const response = await axios.get(
      `/ApplicationGroupData/CompanyBalances/${id}`
    )
    dispatch(balances.getBalancesSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(balances.getBalancesFail(resData))
    return Promise.reject(resData)
  }
}
