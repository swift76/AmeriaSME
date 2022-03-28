import * as AppTypes from 'AppTypes'

import initialState, { IStoreIndustryProducts } from './initialState'

import acTypes from './acTypes'

export const industryProducts = (
  stateStore: IStoreIndustryProducts = initialState,
  action: AppTypes.RootAction
): IStoreIndustryProducts => {
  switch (action.type) {
    case acTypes.GET_INDUSTRY_PRODUCTS_REQUEST: {
      return {
        ...stateStore,
        industryIsLoading: true,
        industryIsLoaded: false,
      }
    }

    case acTypes.GET_INDUSTRY_PRODUCTS_SUCCESS: {
      return {
        ...stateStore,
        industryIsLoading: false,
        industryIsLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_INDUSTRY_PRODUCTS_FAIL: {
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
