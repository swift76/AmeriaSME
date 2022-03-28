import { IApplicationData, IGetApplicationError } from './models'

import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getApplicationRequest = () =>
  action(acTypes.GET_APPLICATION_REQUEST)

export const getApplicationSuccess = (data: IApplicationData) => {
  return action(acTypes.GET_APPLICATION_SUCCESS, data)
}

export const getLatestApplicationSuccess = (data: IApplicationData) => {
  return action(acTypes.GET_LATEST_APPLICATION_SUCCESS, data)
}

export const getApplicationFail = (data: IGetApplicationError) => {
  return action(acTypes.GET_APPLICATION_FAIL, data)
}

export const postApplicationRequrest = () =>
  action(acTypes.SAVE_APPLICATION_REQUEST)

export const postApplicationSuccess = (id: string) =>
  action(acTypes.SAVE_APPLICATION_SUCCESS, id)

export const postApplicationFail = () => action(acTypes.SAVE_APPLICATION_FAIL)

export const resetApplication = () => {
  return action(acTypes.RESET_APPLICATION_DATA)
}
