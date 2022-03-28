import {
  IGetRequestError,
  ISelectDataReceive,
} from '@store/reducers/common-models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getBusinessStateTypesRequest = () => {
  return action(acTypes.GET_BUSINESS_STATE_TYPES_REQUEST)
}

export const getBusinessStateTypesSuccess = (data: ISelectDataReceive[]) => {
  return action(acTypes.GET_BUSINESS_STATE_TYPES_SUCCESS, data)
}

export const getBusinessStateTypesFail = (data: IGetRequestError[]) => {
  return action(acTypes.GET_BUSINESS_STATE_TYPES_FAIL, data)
}
