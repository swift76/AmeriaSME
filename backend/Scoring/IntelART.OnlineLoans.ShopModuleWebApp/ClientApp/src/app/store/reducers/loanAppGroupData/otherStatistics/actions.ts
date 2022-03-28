import { IGetRequestError, IAppCompanyData } from '@store/reducers/common-models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getOtherStatisticsRequest = () => {
  return action(acTypes.GET_OTHER_STATISTICS_REQUEST)
}

export const getOtherStatisticsSuccess = (data: IAppCompanyData[]) => {
  return action(acTypes.GET_OTHER_STATISTICS_SUCCESS, data)
}

export const getOtherStatisticsFail = (data: IGetRequestError[]) => {
  return action(acTypes.GET_OTHER_STATISTICS_FAIL, data)
}
