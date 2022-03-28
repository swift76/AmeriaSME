import * as AppTypes from 'AppTypes'

import initialState, { IStoreMainApplication } from './initialState'

import acTypes from './acTypes'
import userAcTypes from '../user/acTypes'

export const preapprovedResults = (
  stateStore: IStoreMainApplication = initialState,
  action: AppTypes.RootAction
): IStoreMainApplication => {
  switch (action.type) {
    case acTypes.GET_PRE_APPROVED_RESULTS_REQUEST: {
      return {
        ...stateStore,
        resultsIsLoading: true,
        resultsIsLoaded: false,
      }
    }

    case acTypes.GET_PRE_APPROVED_RESULTS_SUCCESS: {
      return {
        ...stateStore,
        resultsIsLoading: false,
        resultsIsLoaded: true,
        data: action.payload,
      }
    }

    case acTypes.GET_PRE_APPROVED_RESULTS_FAIL: {
      return {
        resultsIsLoading: false,
        resultsIsLoaded: false,
        resultsIsFail: true,
        data: initialState.data,
      }
    }

    case acTypes.SAVE_PRE_APPROVED_RESULTS_REQUEST:
      return {
        ...stateStore,
      }
    case acTypes.SAVE_PRE_APPROVED_RESULTS_SUCCESS:
      return {
        ...stateStore,
      }
    case acTypes.SAVE_PRE_APPROVED_RESULTS_FAIL:
      return {
        ...stateStore,
      }

    case acTypes.RESET_PRE_APPROVED_RESULTS_DATA: {
      return {
        ...stateStore,
        data: initialState.data,
      }
    }

    case userAcTypes.USER_LOGOUT: {
      return initialState
    }

    default:
      return stateStore
  }
}
