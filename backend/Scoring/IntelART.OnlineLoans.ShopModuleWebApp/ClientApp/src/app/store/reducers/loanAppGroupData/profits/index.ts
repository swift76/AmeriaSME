import * as AppTypes from 'AppTypes'

import initialState, { IStoreProfits } from './initialState'

import acTypes from './acTypes'

export const profits = (
  stateStore: IStoreProfits = initialState,
  action: AppTypes.RootAction
): IStoreProfits => {
  switch (action.type) {
    case acTypes.GET_PROFITS_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_PROFITS_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_PROFITS_FAIL: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: false,
        isFail: true,
      }
    }

    default:
      return stateStore
  }
}
