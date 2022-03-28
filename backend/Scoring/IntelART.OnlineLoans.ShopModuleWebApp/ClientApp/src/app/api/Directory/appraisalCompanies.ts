import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { directoryActions } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

const { appraisalCompanies } = directoryActions

export const getAppraisalCompanies = () => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(appraisalCompanies.getAppraisalCompaniesRequest())
  try {
    const response = await axios.get(`/Directory/AppraisalCompanies`)
    dispatch(appraisalCompanies.getAppraisalCompaniesSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(appraisalCompanies.getAppraisalCompaniesFail(resData))
    return Promise.reject(resData)
  }
}
