import { IDocument } from '../common-models'
import acTypes from './acTypes'
import { action } from 'typesafe-actions'

export const getDocumentsRequest = () => {
  return action(acTypes.GET_DOCUMENTS_REQUEST)
}

export const getDocumentsSuccess = (data: IDocument[]) => {
  return action(acTypes.GET_DOCUMENTS_SUCCESS, data)
}

export const getDocumentsFail = (error: string) => {
  return action(acTypes.GET_DOCUMENTS_FAIL, error)
}

export const resetDocuments = () => {
  return action(acTypes.RESET_DOCUMENTS)
}
