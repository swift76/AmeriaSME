import {
  IGetRequestError,
  ISelectDataReceive,
} from '@store/reducers/common-models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getFactualIndustriesRequest = () => {
  return action(acTypes.GET_FACTUAL_INDUSTRIES_REQUEST)
}

export const getFactualIndustriesSuccess = (data: ISelectDataReceive[]) => {
  return action(acTypes.GET_FACTUAL_INDUSTRIES_SUCCESS, data)
}

export const getFactualIndustriesFail = (data: IGetRequestError[]) => {
  return action(acTypes.GET_FACTUAL_INDUSTRIES_FAIL, data)
}
