import { IGetLoanLimitsDataReceive } from './models'
import { IGetRequestError } from '../common-models'
import acTypes from './acTypes'
import { action } from 'typesafe-actions'

/*************************************************************************
 * GET APPLICATION ACTION CREATORS
 *************************************************************************/
export const getLoanLimitsRequest = () => {
  return action(acTypes.GET_LOAN_LIMITS_REQUEST)
}

export const getLoanLimitsSuccess = (data: IGetLoanLimitsDataReceive) => {
  return action(acTypes.GET_LOAN_LIMITS_SUCCESS, data)
}

export const getLoanLimitsFetchFail = (data: IGetRequestError) => {
  return action(acTypes.GET_LOAN_LIMITS_FAIL, data)
}
