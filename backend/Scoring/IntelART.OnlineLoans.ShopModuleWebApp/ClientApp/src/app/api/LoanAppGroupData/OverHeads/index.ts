import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { loanAppGroupDataActions } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

const { overheads } = loanAppGroupDataActions

export const getOverHeads = (id: string) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(overheads.getOverheadsRequest())
  try {
    const response = await axios.get(
      `/ApplicationGroupData/CompanyOverheads/${id}`
    )
    dispatch(overheads.getOverheadsSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(overheads.getOverheadsFail(resData))
    return Promise.reject(resData)
  }
}
