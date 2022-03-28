import * as AppTypes from 'AppTypes'

import initialState, { IStoreApplication } from './initialState'

import acTypes from './acTypes'
import userAcTypes from '../user/acTypes'

export const application = (
  stateStore: IStoreApplication = initialState,
  action: AppTypes.RootAction
): IStoreApplication => {
  switch (action.type) {
    case acTypes.GET_APPLICATION_REQUEST: {
      return {
        ...stateStore,
        applocationIsLoading: true,
        applocationLoaded: false,
      }
    }

    case acTypes.GET_APPLICATION_SUCCESS: {
      return {
        ...stateStore,
        applocationIsLoading: false,
        applocationLoaded: true,
        data: { ...action.payload },
      }
    }

    case acTypes.GET_APPLICATION_FAIL: {
      return {
        ...stateStore,
        applocationIsLoading: false,
        applocationLoaded: false,
        applocationFetchFail: true,
        data: { ...initialState.data },
      }
    }

    case acTypes.GET_LATEST_APPLICATION_SUCCESS: {
      return {
        ...stateStore,
        data: {
          ...action.payload,
          ISN: 0,
          INITIAL_AMOUNT: null,
          LOAN_TYPE_ID: '',
          CURRENCY_CODE: '',
        },
      }
    }

    case acTypes.SAVE_APPLICATION_REQUEST:
      return {
        ...stateStore,
        applocationIsLoading: true,
        applocationLoaded: false,
      }
    case acTypes.SAVE_APPLICATION_SUCCESS:
      return {
        ...stateStore,
        applocationIsLoading: false,
        applocationLoaded: true,
        data: {
          ...stateStore.data,
          ID: action.payload,
        },
      }
    case acTypes.SAVE_APPLICATION_FAIL:
      return {
        ...stateStore,
        applocationIsLoading: false,
        applocationLoaded: false,
        applocationFetchFail: true,
      }

    case acTypes.RESET_APPLICATION_DATA: {
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
