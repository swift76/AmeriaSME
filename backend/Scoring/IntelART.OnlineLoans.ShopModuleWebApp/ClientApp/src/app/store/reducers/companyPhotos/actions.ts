import { ILoanPhotos } from './models'
import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getPhotosRequest = () => {
  return action(acTypes.GET_PHOTOS_REQUEST)
}

export const getPhotosSuccess = (data: ILoanPhotos[]) => {
  return action(acTypes.GET_PHOTOS_SUCCESS, data)
}

export const getPhotosFail = (error: string) => {
  return action(acTypes.GET_PHOTOS_FAIL, error)
}

export const resetPhotos = () => {
  return action(acTypes.RESET_PHOTOS)
}

export const setNewPhoto = (photo: ILoanPhotos) => {
  return action(acTypes.SET_NEW_PHOTO, photo)
}

export const removePhoto = (id: number) => {
  return action(acTypes.REMOVE_PHOTO, id)
}

export const setPhotosCount = (count: number, pledge: boolean) => {
  return action(acTypes.SET_PHOTOS_COUNT, { count, pledge })
}
