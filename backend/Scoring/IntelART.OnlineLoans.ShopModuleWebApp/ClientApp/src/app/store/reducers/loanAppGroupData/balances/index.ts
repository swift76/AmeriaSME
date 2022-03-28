import * as AppTypes from 'AppTypes'

import initialState, { IStoreBalances } from './initialState'

import acTypes from './acTypes'

export const balances = (
  stateStore: IStoreBalances = initialState,
  action: AppTypes.RootAction
): IStoreBalances => {
  switch (action.type) {
    case acTypes.GET_BALANCES_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_BALANCES_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_BALANCES_FAIL: {
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
