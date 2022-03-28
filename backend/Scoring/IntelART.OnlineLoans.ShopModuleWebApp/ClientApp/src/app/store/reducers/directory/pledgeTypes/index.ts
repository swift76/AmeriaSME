import * as AppTypes from 'AppTypes'

import initialState, { IStorePledgeTypes } from './initialState'

import acTypes from './acTypes'

export const pledgeTypes = (
  stateStore: IStorePledgeTypes = initialState,
  action: AppTypes.RootAction
): IStorePledgeTypes => {
  switch (action.type) {
    case acTypes.GET_PLEDGE_TYPES_REQUEST: {
      return {
        ...stateStore,
        loanTypesIsLoading: true,
        loanTypesLoaded: false,
      }
    }

    case acTypes.GET_PLEDGE_TYPES_SUCCESS: {
      return {
        ...stateStore,
        loanTypesIsLoading: false,
        loanTypesLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_PLEDGE_TYPES_FAIL: {
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
