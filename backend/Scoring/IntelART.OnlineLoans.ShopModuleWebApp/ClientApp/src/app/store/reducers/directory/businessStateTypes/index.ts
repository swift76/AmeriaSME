import * as AppTypes from 'AppTypes'

import initialState, { IStoreBusinessStateTypes } from './initialState'

import acTypes from './acTypes'

export const businessStateTypes = (
  stateStore: IStoreBusinessStateTypes = initialState,
  action: AppTypes.RootAction
): IStoreBusinessStateTypes => {
  switch (action.type) {
    case acTypes.GET_BUSINESS_STATE_TYPES_REQUEST: {
      return {
        ...stateStore,
        businessStateTypesIsLoading: true,
        businessStateTypesLoaded: false,
      }
    }

    case acTypes.GET_BUSINESS_STATE_TYPES_SUCCESS: {
      return {
        ...stateStore,
        businessStateTypesIsLoading: false,
        businessStateTypesLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_BUSINESS_STATE_TYPES_FAIL: {
      return {
        ...stateStore,
        businessStateTypesIsLoading: false,
        businessStateTypesLoaded: false,
        businessStateTypesFetchFail: true,
      }
    }

    default:
      return stateStore
  }
}
