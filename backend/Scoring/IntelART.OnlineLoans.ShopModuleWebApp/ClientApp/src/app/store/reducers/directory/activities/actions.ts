import {
  IGetRequestError,
  ISelectDataReceive,
} from '@store/reducers/common-models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getActivitiesRequest = () => {
  return action(acTypes.GET_ACTIVITIES_REQUEST)
}

export const getActivitiesSuccess = (data: ISelectDataReceive[]) => {
  return action(acTypes.GET_ACTIVITIES_SUCCESS, data)
}

export const getActivitiesFail = (data: IGetRequestError[]) => {
  return action(acTypes.GET_ACTIVITIES_FAIL, data)
}
