import * as AppTypes from 'AppTypes'

import initialState, { IStoreInsuranceCompanies } from './initialState'

import acTypes from './acTypes'

export const insuranceCompanies = (
  stateStore: IStoreInsuranceCompanies = initialState,
  action: AppTypes.RootAction
): IStoreInsuranceCompanies => {
  switch (action.type) {
    case acTypes.GET_INSURANCE_COMPANIES_REQUEST: {
      return {
        ...stateStore,
        industiresIsLoading: true,
        industiresLoaded: false,
      }
    }

    case acTypes.GET_INSURANCE_COMPANIES_SUCCESS: {
      return {
        ...stateStore,
        industiresIsLoading: false,
        industiresLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_INSURANCE_COMPANIES_FAIL: {
      return {
        ...stateStore,
        industiresIsLoading: false,
        industiresLoaded: false,
        industiresFetchFail: true,
      }
    }

    default:
      return stateStore
  }
}
