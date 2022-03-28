import * as AppTypes from 'AppTypes'

import initialState, { IStoreAppraisalCompanies } from './initialState'

import acTypes from './acTypes'

export const appraisalCompanies = (
  stateStore: IStoreAppraisalCompanies = initialState,
  action: AppTypes.RootAction
): IStoreAppraisalCompanies => {
  switch (action.type) {
    case acTypes.GET_APPRAISAL_COMPANIES_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_APPRAISAL_COMPANIES_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_APPRAISAL_COMPANIES_FAIL: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: false,
        isFetchFail: true,
      }
    }

    default:
      return stateStore
  }
}
