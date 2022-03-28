import * as AppTypes from 'AppTypes'

import initialState, { IStoreIndustires } from './initialState'

import acTypes from './acTypes'

export const facutalIndustires = (
  stateStore: IStoreIndustires = initialState,
  action: AppTypes.RootAction
): IStoreIndustires => {
  switch (action.type) {
    case acTypes.GET_FACTUAL_INDUSTRIES_REQUEST: {
      return {
        ...stateStore,
        industiresIsLoading: true,
        industiresLoaded: false,
      }
    }

    case acTypes.GET_FACTUAL_INDUSTRIES_SUCCESS: {
      return {
        ...stateStore,
        industiresIsLoading: false,
        industiresLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_FACTUAL_INDUSTRIES_FAIL: {
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
