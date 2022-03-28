import * as AppTypes from 'AppTypes'

import initialState, { IStoreBadMonthEarnings } from './initialState'

import acTypes from './acTypes'

export const badMonthEarnings = (
  stateStore: IStoreBadMonthEarnings = initialState,
  action: AppTypes.RootAction
): IStoreBadMonthEarnings => {
  switch (action.type) {
    case acTypes.GET_BAD_MONTH_EARNINGS_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_BAD_MONTH_EARNINGS_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_BAD_MONTH_EARNINGS_FAIL: {
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
