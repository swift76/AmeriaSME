import * as AppTypes from 'AppTypes'

import initialState, { IStoreLimits } from './initialState'

import acTypes from './acTypes'

export const loanLimits = (
  stateStore: IStoreLimits = initialState,
  action: AppTypes.RootAction
): IStoreLimits => {
  switch (action.type) {
    case acTypes.GET_LOAN_LIMITS_REQUEST: {
      return {
        ...stateStore,
        limitsIsLoading: true,
        limitsLoaded: false,
      }
    }

    case acTypes.GET_LOAN_LIMITS_SUCCESS: {
      return {
        ...stateStore,
        limitsIsLoading: false,
        limitsLoaded: true,
        data: { ...action.payload },
      }
    }

    case acTypes.GET_LOAN_LIMITS_FAIL: {
      return {
        ...stateStore,
        limitsIsLoading: false,
        limitsLoaded: false,
        limitsFetchFail: true,
        data: initialState.data,
      }
    }

    default:
      return stateStore
  }
}
