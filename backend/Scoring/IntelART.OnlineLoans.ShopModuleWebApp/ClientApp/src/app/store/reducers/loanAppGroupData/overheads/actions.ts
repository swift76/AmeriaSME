import { IGetRequestError, IOverheadsData } from '@store/reducers/common-models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getOverheadsRequest = () => {
  return action(acTypes.GET_OVERHEADS_REQUEST)
}

export const getOverheadsSuccess = (data: IOverheadsData[]) => {
  return action(acTypes.GET_OVERHEADS_SUCCESS, data)
}

export const getOverheadsFail = (data: IGetRequestError[]) => {
  return action(acTypes.GET_OVERHEADS_FAIL, data)
}
