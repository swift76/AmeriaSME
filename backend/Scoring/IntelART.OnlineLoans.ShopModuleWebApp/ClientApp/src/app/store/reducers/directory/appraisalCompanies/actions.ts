import {
  IGetRequestError,
  ISelectDataReceive,
} from '@store/reducers/common-models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getAppraisalCompaniesRequest = () => {
  return action(acTypes.GET_APPRAISAL_COMPANIES_REQUEST)
}

export const getAppraisalCompaniesSuccess = (data: ISelectDataReceive[]) => {
  return action(acTypes.GET_APPRAISAL_COMPANIES_SUCCESS, data)
}

export const getAppraisalCompaniesFail = (data: IGetRequestError[]) => {
  return action(acTypes.GET_APPRAISAL_COMPANIES_FAIL, data)
}
