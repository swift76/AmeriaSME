import { IModalOptions } from './models'
import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const openModal = (options: IModalOptions) => {
  return action(acTypes.OPEN_MODAL, options)
}

export const closeModal = () => {
  return action(acTypes.CLOSE_MODAL)
}

export const setModalOptions = (options: IModalOptions) => {
  return action(acTypes.SET_MODAL_OPTIONS, options)
}
