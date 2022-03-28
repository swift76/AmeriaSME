import * as AppTypes from 'AppTypes'

import initialState, { IStoreOverheads } from './initialState'

import acTypes from './acTypes'

export const overheads = (
  stateStore: IStoreOverheads = initialState,
  action: AppTypes.RootAction
): IStoreOverheads => {
  switch (action.type) {
    case acTypes.GET_OVERHEADS_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_OVERHEADS_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_OVERHEADS_FAIL: {
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
