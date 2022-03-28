import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import { loanSettingsAction as actions } from '@store/reducers/root-actions'
import axios from 'app/api'
import { toast } from 'react-toastify'

export const getLoanSettings = () => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(actions.getLoanSettingsRequest())
  try {
    const response = await axios.get(`/Settings/LoanSettings`)
    dispatch(actions.getLoanSettingsSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(actions.getLoanSettingsFetchFail(resData))
    return Promise.reject(resData)
  }
}

export const getFileMaxSize = () => async (dispatch: Dispatch<AnyAction>) => {
  try {
    const response = await axios.get(`/Settings/FileMaxSize`)
    dispatch(actions.getLoanFileMaxSizeSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    return Promise.reject(resData)
  }
}

export const getUnsecuredLimits = () => async (
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const response = await axios.get(`/Settings/ApplicationUnsecuredLimits`)
    dispatch(actions.getLoanUnsecuredLimitsSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    return Promise.reject(resData)
  }
}

export const getLoanSpecialistLoanTerms = () => async (
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const response = await axios.get(`/Settings/LoanSpecialistLoanTerms`)
    dispatch(actions.getLoanSpecialistLoanTermsSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    return Promise.reject(resData)
  }
}
