import {
  IGetRequestError,
  ISelectDataReceive,
} from '@store/reducers/common-models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getCountriesRequest = () => {
  return action(acTypes.GET_CURRENCIES_REQUEST)
}

export const getCountriesSuccess = (
  data: ISelectDataReceive[],
  loanType: string
) => {
  return action(acTypes.GET_CURRENCIES_SUCCESS, {
    [loanType]: data,
  })
}

export const getCountriesFail = (data: IGetRequestError[]) => {
  return action(acTypes.GET_CURRENCIES_FAIL, data)
}
