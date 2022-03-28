import * as AppTypes from 'AppTypes'

import initialState, { IStoreGoodMonthEarnings } from './initialState'

import acTypes from './acTypes'

export const goodMonthEarnings = (
  stateStore: IStoreGoodMonthEarnings = initialState,
  action: AppTypes.RootAction
): IStoreGoodMonthEarnings => {
  switch (action.type) {
    case acTypes.GET_GOOD_MONTH_EARNINGS_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_GOOD_MONTH_EARNINGS_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_GOOD_MONTH_EARNINGS_FAIL: {
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
