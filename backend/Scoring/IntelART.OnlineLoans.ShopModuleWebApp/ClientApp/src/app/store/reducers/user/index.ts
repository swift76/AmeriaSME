import * as AppTypes from 'AppTypes'

import initialState, { IStoreUser } from './initialState'

import JwtService from '@app/services/jwtService'
import acTypes from './acTypes'

export const user = (
  stateStore: IStoreUser = initialState,
  action: AppTypes.RootAction
): IStoreUser => {
  switch (action.type) {
    // USER LOGIN PART
    case acTypes.USER_LOGIN_REQUEST: {
      return {
        ...stateStore,
        userLoggingIn: true,
        userLoggingFail: false,
      }
    }

    case acTypes.USER_LOGIN_SUCCESS: {
      JwtService.setSession(action.payload.access_token)
      return {
        ...stateStore,
        userLoggingIn: false,
        userLoggedIn: true,
        userLoggingFail: false,
      }
    }

    case acTypes.USER_LOGIN_FAIL: {
      return {
        ...stateStore,
        userLoggingIn: false,
        userLoggingFail: true,
      }
    }

    case acTypes.RESET_USER_LOGIN_FETCH_FAIL: {
      return {
        ...stateStore,
        userLoggingIn: false,
        userLoggingFail: false,
      }
    }

    //USER INFO PART
    case acTypes.USER_INFO_FETCH_REQUEST: {
      return {
        ...stateStore,
        userInfoLoading: true,
        userInfoLoadError: false,
      }
    }

    case acTypes.USER_INFO_FETCH_SUCCESS: {
      JwtService.setUserInfo(JSON.stringify(action.payload))

      return {
        ...stateStore,
        userInfo: action.payload,
        userInfoLoading: false,
        userInfoLoaded: true,
      }
    }

    case acTypes.USER_INFO_FETCH_FAIL: {
      return {
        ...stateStore,
        userInfoLoading: false,
        userInfoLoadError: true,
      }
    }

    case acTypes.USER_LOGOUT: {
      JwtService.logout()
      return {
        ...initialState,
        userLoggedIn: false,
      }
    }

    default:
      return stateStore
  }
}
