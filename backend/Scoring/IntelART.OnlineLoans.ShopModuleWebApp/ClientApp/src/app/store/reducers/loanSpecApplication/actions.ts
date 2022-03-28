import { IGetRequestError } from '../common-models'
import { ILoanSpecApplicationData } from './models'
import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getLoanSpecApplicationRequest = () =>
  action(acTypes.GET_LOAN_SPEC_APPLICATION_REQUEST)

export const getLoanSpecApplicationSuccess = (
  data: ILoanSpecApplicationData
) => {
  return action(acTypes.GET_LOAN_SPEC_APPLICATION_SUCCESS, data)
}

export const getLoanSpecApplicationFail = (data: IGetRequestError) => {
  return action(acTypes.GET_LOAN_SPEC_APPLICATION_FAIL, data)
}

export const postLoanSpecApplicationRequrest = () =>
  action(acTypes.SAVE_LOAN_SPEC_APPLICATION_REQUEST)

export const postLoanSpecApplicationSuccess = (id: string) =>
  action(acTypes.SAVE_LOAN_SPEC_APPLICATION_SUCCESS, id)

export const postLoanSpecApplicationFail = () =>
  action(acTypes.SAVE_LOAN_SPEC_APPLICATION_FAIL)

export const resetLoanSpecApplication = () => {
  return action(acTypes.RESET_LOAN_SPEC_APPLICATION_DATA)
}
