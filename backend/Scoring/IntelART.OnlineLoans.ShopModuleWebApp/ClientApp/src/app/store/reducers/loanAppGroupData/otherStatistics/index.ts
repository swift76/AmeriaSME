import * as AppTypes from 'AppTypes'

import initialState, { IStoreOtherStatistics } from './initialState'

import acTypes from './acTypes'

export const otherStatistics = (
  stateStore: IStoreOtherStatistics = initialState,
  action: AppTypes.RootAction
): IStoreOtherStatistics => {
  switch (action.type) {
    case acTypes.GET_OTHER_STATISTICS_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_OTHER_STATISTICS_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_OTHER_STATISTICS_FAIL: {
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
