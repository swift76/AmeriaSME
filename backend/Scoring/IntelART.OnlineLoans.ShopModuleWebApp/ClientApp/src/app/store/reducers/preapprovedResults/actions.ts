import { IGetRequestError } from '../common-models'
import { IPreApprovedResultsData } from './models'
import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getPreApprovedResultsRequest = () =>
  action(acTypes.GET_PRE_APPROVED_RESULTS_REQUEST)

export const getPreApprovedResultsSuccess = (
  data: IPreApprovedResultsData[]
) => {
  return action(acTypes.GET_PRE_APPROVED_RESULTS_SUCCESS, data)
}

export const getPreApprovedResultsFail = (data: IGetRequestError) => {
  return action(acTypes.GET_PRE_APPROVED_RESULTS_FAIL, data)
}

export const postPreApprovedResultsRequest = () =>
  action(acTypes.SAVE_PRE_APPROVED_RESULTS_REQUEST)

export const postPreApprovedResultsSuccess = (id: string) =>
  action(acTypes.SAVE_PRE_APPROVED_RESULTS_SUCCESS, id)

export const postPreApprovedResultsFail = () =>
  action(acTypes.SAVE_PRE_APPROVED_RESULTS_FAIL)

export const resetPreApprovedResults = () => {
  return action(acTypes.RESET_PRE_APPROVED_RESULTS_DATA)
}
