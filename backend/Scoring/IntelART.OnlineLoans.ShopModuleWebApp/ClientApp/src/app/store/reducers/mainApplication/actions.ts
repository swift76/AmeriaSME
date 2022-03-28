import { IGetMainApplicationData } from './models'
import { IGetRequestError } from '../common-models'
import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getMainApplicationRequest = () =>
  action(acTypes.GET_MAIN_APPLICATION_REQUEST)

export const getMainApplicationSuccess = (data: IGetMainApplicationData) => {
  return action(acTypes.GET_MAIN_APPLICATION_SUCCESS, data)
}

export const getMainApplicationFail = (data: IGetRequestError) => {
  return action(acTypes.GET_MAIN_APPLICATION_FAIL, data)
}

export const postMainApplicationRequrest = () =>
  action(acTypes.SAVE_MAIN_APPLICATION_REQUEST)

export const postMainApplicationSuccess = (id: string) =>
  action(acTypes.SAVE_MAIN_APPLICATION_SUCCESS, id)

export const postMainApplicationFail = () =>
  action(acTypes.SAVE_MAIN_APPLICATION_FAIL)

export const resetMainApplication = () => {
  return action(acTypes.RESET_MAIN_APPLICATION_DATA)
}
