import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { loanAppGroupDataActions } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

const { opExpenses } = loanAppGroupDataActions

export const getOpExpanses = (id: string) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(opExpenses.getOpExpensesRequest())
  try {
    const response = await axios.get(
      `/ApplicationGroupData/CompanyOperationalExpenses/${id}`
    )
    dispatch(opExpenses.getOpExpensesSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(opExpenses.getOpExpensesFail(resData))
    return Promise.reject(resData)
  }
}
