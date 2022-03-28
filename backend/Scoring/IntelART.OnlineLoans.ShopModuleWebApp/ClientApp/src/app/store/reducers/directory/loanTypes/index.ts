import * as AppTypes from 'AppTypes'

import initialState, { IStoreLoanTypes } from './initialState'

import acTypes from './acTypes'

export const loanTypes = (
  stateStore: IStoreLoanTypes = initialState,
  action: AppTypes.RootAction
): IStoreLoanTypes => {
  switch (action.type) {
    case acTypes.GET_LOAN_TYPES_REQUEST: {
      return {
        ...stateStore,
        loanTypesIsLoading: true,
        loanTypesLoaded: false,
      }
    }

    case acTypes.GET_LOAN_TYPES_SUCCESS: {
      return {
        ...stateStore,
        loanTypesIsLoading: false,
        loanTypesLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_LOAN_TYPES_FAIL: {
      return {
        ...stateStore,
        loanTypesIsLoading: false,
        loanTypesLoaded: false,
        loanTypesFetchFail: true,
      }
    }

    default:
      return stateStore
  }
}
