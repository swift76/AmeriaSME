import {
  IGetRequestError,
  ISelectDataReceive,
} from '@store/reducers/common-models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getIndustryTypesRequest = () => {
  return action(acTypes.GET_INDUSTRY_TYPES_REQUEST)
}

export const getIndustryTypesSuccess = (data: ISelectDataReceive[]) => {
  return action(acTypes.GET_INDUSTRY_TYPES_SUCCESS, data)
}

export const getIndustryTypesFail = (data: IGetRequestError[]) => {
  return action(acTypes.GET_INDUSTRY_TYPES_FAIL, data)
}
