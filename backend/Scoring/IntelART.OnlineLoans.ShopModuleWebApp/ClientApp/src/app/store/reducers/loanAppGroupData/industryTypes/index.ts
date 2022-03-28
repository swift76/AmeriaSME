import * as AppTypes from 'AppTypes'

import initialState, { IStoreIndustryTypes } from './initialState'

import acTypes from './acTypes'

export const industryTypes = (
  stateStore: IStoreIndustryTypes = initialState,
  action: AppTypes.RootAction
): IStoreIndustryTypes => {
  switch (action.type) {
    case acTypes.GET_INDUSTRY_TYPES_REQUEST: {
      return {
        ...stateStore,
        industryIsLoading: true,
        industryIsLoaded: false,
      }
    }

    case acTypes.GET_INDUSTRY_TYPES_SUCCESS: {
      return {
        ...stateStore,
        industryIsLoading: false,
        industryIsLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_INDUSTRY_TYPES_FAIL: {
      return {
        ...stateStore,
        industryIsLoading: false,
        industryIsLoaded: false,
        industryIsFail: true,
      }
    }

    default:
      return stateStore
  }
}
