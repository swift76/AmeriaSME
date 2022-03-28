import {
  IGetApplicationsDataReceive,
  IGetApplicationsError,
  IGetApplicationsParams,
} from './models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

/*************************************************************************
 * GET APPLICATION ACTION CREATORS
 *************************************************************************/
export const getApplicationsRequest = () => {
  return action(acTypes.GET_APPLICATIONS_REQUEST)
}

export const getApplicationsSuccess = (data: IGetApplicationsDataReceive[]) => {
  return action(acTypes.GET_APPLICATIONS_SUCCESS, data)
}

export const getApplicationsFail = (data: IGetApplicationsError) => {
  return action(acTypes.GET_APPLICATIONS_FAIL, data)
}

export const setApplicationsParams = (data: IGetApplicationsParams) => {
  return action(acTypes.SET_APPLICATIONS_PARAMS, data)
}

export const resetApplications = () => {
  return action(acTypes.RESET_APPLICATIONS_DATA)
}
