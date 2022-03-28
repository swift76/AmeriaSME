import * as AppTypes from 'AppTypes'

import initialState, { IStoreCancelReasons } from './initialState'

import acTypes from './acTypes'

export const cancelReasons = (
  stateStore: IStoreCancelReasons = initialState,
  action: AppTypes.RootAction
): IStoreCancelReasons => {
  switch (action.type) {
    case acTypes.GET_CANCELREASONS_REQUEST: {
      return {
        ...stateStore,
        cancelReasonsIsLoading: true,
        cancelReasonsLoaded: false,
      }
    }

    case acTypes.GET_CANCELREASONS_SUCCESS: {
      return {
        ...stateStore,
        cancelReasonsIsLoading: false,
        cancelReasonsLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_CANCELREASONS_FAIL: {
      return {
        ...stateStore,
        cancelReasonsIsLoading: false,
        cancelReasonsLoaded: false,
        cancelReasonsFetchFail: true,
      }
    }

    default:
      return stateStore
  }
}
