import * as AppTypes from 'AppTypes'

import initialState, { IStoreParameters } from './initialState'

import acTypes from './acTypes'

export const loanParameters = (
  stateStore: IStoreParameters = initialState,
  action: AppTypes.RootAction
): IStoreParameters => {
  switch (action.type) {
    case acTypes.GET_LOAN_PARAMETERS_REQUEST: {
      return {
        ...stateStore,
        paramsIsLoading: true,
        paramsLoaded: false,
      }
    }

    case acTypes.GET_LOAN_PARAMETERS_SUCCESS: {
      return {
        ...stateStore,
        paramsIsLoading: false,
        paramsLoaded: true,
        data: { ...action.payload },
      }
    }

    case acTypes.GET_LOAN_PARAMETERS_FAIL: {
      return {
        ...stateStore,
        paramsIsLoading: false,
        paramsLoaded: false,
        paramsFetchFail: true,
        data: initialState.data,
      }
    }

    default:
      return stateStore
  }
}
