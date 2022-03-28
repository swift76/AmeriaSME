import { IUserInfoData, IUserLoginData, IUserLoginError } from './models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

// USER LOGIN ACTION CREATORS
export const userLoginRequest = () => action(acTypes.USER_LOGIN_REQUEST)

export const userLoginSuccess = (data: IUserLoginData) => {
  return action(acTypes.USER_LOGIN_SUCCESS, data)
}

export const userLoginFail = (error: IUserLoginError | null) => {
  return action(acTypes.USER_LOGIN_FAIL, error)
}

export const resetUserLoginFail = () => {
  return action(acTypes.RESET_USER_LOGIN_FETCH_FAIL)
}

// USER INFO FETCH ACTION CREATORS
export const userInfoFetchRequest = () => {
  return action(acTypes.USER_INFO_FETCH_REQUEST)
}

export const userInfoFetchSuccess = (data: IUserInfoData) => {
  return action(acTypes.USER_INFO_FETCH_SUCCESS, data)
}

export const userInfoFetchFail = () => {
  return action(acTypes.USER_INFO_FETCH_FAIL)
}

// USER LOGOUT ACTION CREATORS
export const userLogout = () => {
  return action(acTypes.USER_LOGOUT)
}
