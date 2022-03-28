import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { directoryActions } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

const { insuranceCompanies } = directoryActions

export const getInsuranceCompanies = () => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(insuranceCompanies.getInsuranceCompaniesRequest())
  try {
    const response = await axios.get(`/Directory/InsuranceCompanies`)
    dispatch(insuranceCompanies.getInsuranceCompaniesSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(insuranceCompanies.getInsuranceCompaniesFail(resData))
    return Promise.reject(resData)
  }
}
