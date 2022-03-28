import * as AppTypes from 'AppTypes'

import initialState, { IStoreLoanSpecApplication } from './initialState'

import acTypes from './acTypes'
import userAcTypes from '../user/acTypes'

export const loanSpecApplication = (
  stateStore: IStoreLoanSpecApplication = initialState,
  action: AppTypes.RootAction
): IStoreLoanSpecApplication => {
  switch (action.type) {
    case acTypes.GET_LOAN_SPEC_APPLICATION_REQUEST: {
      return {
        ...stateStore,
        applocationIsLoading: true,
        applocationLoaded: false,
      }
    }

    case acTypes.GET_LOAN_SPEC_APPLICATION_SUCCESS: {
      return {
        ...stateStore,
        applocationIsLoading: false,
        applocationLoaded: true,
        data: { ...action.payload },
      }
    }

    case acTypes.GET_LOAN_SPEC_APPLICATION_FAIL: {
      return {
        ...stateStore,
        applocationIsLoading: false,
        applocationLoaded: false,
        applocationFetchFail: true,
        data: { ...initialState.data },
      }
    }

    case acTypes.SAVE_LOAN_SPEC_APPLICATION_REQUEST:
      return {
        ...stateStore,
        applocationIsLoading: true,
        applocationLoaded: false,
      }
    case acTypes.SAVE_LOAN_SPEC_APPLICATION_SUCCESS:
      return {
        ...stateStore,
        applocationIsLoading: false,
        applocationLoaded: true,
        data: {
          ...stateStore.data,
          ID: action.payload,
        },
      }
    case acTypes.SAVE_LOAN_SPEC_APPLICATION_FAIL:
      return {
        ...stateStore,
        applocationIsLoading: false,
        applocationLoaded: false,
        applocationFetchFail: true,
      }

    case acTypes.RESET_LOAN_SPEC_APPLICATION_DATA: {
      return {
        ...stateStore,
        data: { ...initialState.data },
      }
    }

    case userAcTypes.USER_LOGOUT: {
      return initialState
    }

    default:
      return stateStore
  }
}
