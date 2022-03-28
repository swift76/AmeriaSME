import * as AppTypes from 'AppTypes'

import initialState, { IStorePledgers } from './initialState'

import acTypes from './acTypes'

export const pledgers = (
  stateStore: IStorePledgers = initialState,
  action: AppTypes.RootAction
): IStorePledgers => {
  switch (action.type) {
    case acTypes.GET_PLEDGERS_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_PLEDGERS_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_PLEDGERS_FAIL: {
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
