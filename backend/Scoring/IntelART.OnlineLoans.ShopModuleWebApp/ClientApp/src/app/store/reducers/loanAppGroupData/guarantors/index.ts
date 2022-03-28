import * as AppTypes from 'AppTypes'

import initialState, { IStoreGuarantors } from './initialState'

import acTypes from './acTypes'

export const guarantors = (
  stateStore: IStoreGuarantors = initialState,
  action: AppTypes.RootAction
): IStoreGuarantors => {
  switch (action.type) {
    case acTypes.GET_GUARANTORS_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_GUARANTORS_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_GUARANTORS_FAIL: {
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
