import {
  IGetLoanSettingsDataReceive,
  IGetLoanUnsecuredLimitsDataReceive,
  IGetSettingsError,
} from './models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getLoanSettingsRequest = () => {
  return action(acTypes.GET_LOAN_SETTINGS_REQUEST)
}

export const getLoanSettingsSuccess = (data: IGetLoanSettingsDataReceive) => {
  return action(acTypes.GET_LOAN_SETTINGS_SUCCESS, data)
}

export const getLoanSettingsFetchFail = (data: IGetSettingsError) => {
  return action(acTypes.GET_LOAN_SETTINGS_FAIL, data)
}

export const getLoanUnsecuredLimitsSuccess = (
  data: IGetLoanUnsecuredLimitsDataReceive[]
) => {
  return action(acTypes.GET_LOAN_UNSECUREDLIMITS_SUCCESS, data)
}

export const getLoanSpecialistLoanTermsSuccess = (data: string[]) => {
  return action(acTypes.GET_LOAN_SPECIALIST_LOAN_TERMS_SUCCESS, data)
}

export const getLoanFileMaxSizeSuccess = (data: number) => {
  return action(acTypes.GET_LOAN_FILEMAXSIZE_SUCCESS, data)
}
