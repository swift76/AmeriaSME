import { IGetRequestError, IAppCompanyData } from '@store/reducers/common-models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getProfitsRequest = () => {
  return action(acTypes.GET_PROFITS_REQUEST)
}

export const getProfitsSuccess = (data: IAppCompanyData[]) => {
  return action(acTypes.GET_PROFITS_SUCCESS, data)
}

export const getProfitsFail = (data: IGetRequestError[]) => {
  return action(acTypes.GET_PROFITS_FAIL, data)
}
