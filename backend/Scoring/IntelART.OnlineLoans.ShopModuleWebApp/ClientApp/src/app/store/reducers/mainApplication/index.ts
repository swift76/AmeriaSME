import * as AppTypes from 'AppTypes'

import initialState, { IStoreMainApplication } from './initialState'

import acTypes from './acTypes'
import userAcTypes from '../user/acTypes'

export const mainApplication = (
  stateStore: IStoreMainApplication = initialState,
  action: AppTypes.RootAction
): IStoreMainApplication => {
  switch (action.type) {
    case acTypes.GET_MAIN_APPLICATION_REQUEST: {
      return {
        ...stateStore,
        mainApplocationIsLoading: true,
        mainApplocationLoaded: false,
      }
    }

    case acTypes.GET_MAIN_APPLICATION_SUCCESS: {
      return {
        ...stateStore,
        mainApplocationIsLoading: false,
        mainApplocationLoaded: true,
        data: { ...action.payload },
      }
    }

    case acTypes.GET_MAIN_APPLICATION_FAIL: {
      return {
        ...stateStore,
        mainApplocationIsLoading: false,
        mainApplocationLoaded: false,
        mainApplocationFetchFail: true,
        data: { ...initialState.data },
      }
    }

    case acTypes.SAVE_MAIN_APPLICATION_REQUEST:
      return {
        ...stateStore,
      }
    case acTypes.SAVE_MAIN_APPLICATION_SUCCESS:
      return {
        ...stateStore,
      }
    case acTypes.SAVE_MAIN_APPLICATION_FAIL:
      return {
        ...stateStore,
      }

    case acTypes.RESET_MAIN_APPLICATION_DATA: {
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
