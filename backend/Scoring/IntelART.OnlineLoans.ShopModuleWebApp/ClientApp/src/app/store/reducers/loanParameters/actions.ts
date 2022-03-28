import { IGetParametersDataReceive } from './models'
import { IGetRequestError } from '../common-models'
import acTypes from './acTypes'
import { action } from 'typesafe-actions'

/*************************************************************************
 * GET APPLICATION ACTION CREATORS
 *************************************************************************/
export const getLoanParametersRequest = () => {
  return action(acTypes.GET_LOAN_PARAMETERS_REQUEST)
}

export const getLoanParametersSuccess = (data: IGetParametersDataReceive) => {
  return action(acTypes.GET_LOAN_PARAMETERS_SUCCESS, data)
}

export const getLoanParametersFetchFail = (data: IGetRequestError) => {
  return action(acTypes.GET_LOAN_PARAMETERS_FAIL, data)
}
