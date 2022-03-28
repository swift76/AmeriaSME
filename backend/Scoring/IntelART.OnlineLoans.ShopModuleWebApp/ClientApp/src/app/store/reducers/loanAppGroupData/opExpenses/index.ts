import * as AppTypes from 'AppTypes'

import initialState, { IStoreOpExpanses } from './initialState'

import acTypes from './acTypes'

export const opExpenses = (
  stateStore: IStoreOpExpanses = initialState,
  action: AppTypes.RootAction
): IStoreOpExpanses => {
  switch (action.type) {
    case acTypes.GET_OP_EXPENSES_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_OP_EXPENSES_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_OP_EXPENSES_FAIL: {
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
