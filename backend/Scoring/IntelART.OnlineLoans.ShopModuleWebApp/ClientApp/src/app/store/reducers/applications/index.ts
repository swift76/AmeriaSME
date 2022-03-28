import * as AppTypes from 'AppTypes'

import initialState, { IStoreApplications } from './initialState'

import acTypes from './acTypes'
import userAcTypes from '../user/acTypes'

export const applications = (
  stateStore: IStoreApplications = initialState,
  action: AppTypes.RootAction
): IStoreApplications => {
  switch (action.type) {
    case acTypes.GET_APPLICATIONS_REQUEST: {
      return {
        ...stateStore,
        applocationsIsLoading: true,
        applocationsLoaded: false,
      }
    }

    case acTypes.GET_APPLICATIONS_SUCCESS: {
      return {
        ...stateStore,
        applocationsIsLoading: false,
        applocationsLoaded: true,
        applocationsFetchFail: false,
        data: [...action.payload],
      }
    }

    case acTypes.GET_APPLICATIONS_FAIL: {
      return {
        ...stateStore,
        applocationsIsLoading: false,
        applocationsLoaded: false,
        applocationsFetchFail: true,
        data: [...initialState.data],
      }
    }

    case acTypes.RESET_APPLICATIONS_DATA: {
      return {
        ...stateStore,
        applocationsIsLoading: false,
        applocationsLoaded: false,
        applocationsFetchFail: false,
        data: [...initialState.data],
      }
    }

    case acTypes.SET_APPLICATIONS_PARAMS: {
      return {
        ...stateStore,
        params: { ...action.payload },
      }
    }

    case userAcTypes.USER_LOGOUT: {
      return initialState
    }

    default:
      return stateStore
  }
}
