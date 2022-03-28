import * as AppTypes from 'AppTypes'

import initialState, { IStoreDocuments } from './initialState'

import _ from 'lodash'
import acTypes from './acTypes'

export const documents = (
  stateStore: IStoreDocuments = initialState,
  action: AppTypes.RootAction
): IStoreDocuments => {
  switch (action.type) {
    case acTypes.GET_DOCUMENTS_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_DOCUMENTS_SUCCESS: {
      const data = action.payload
      const newData = initialState.data
        .slice(data.length)
        .concat(data)
        .sort((a: any, b: any) => (a.ID > b.ID ? -1 : 1))

      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        isFail: false,
        data: newData,
      }
    }

    case acTypes.RESET_DOCUMENTS: {
      return {
        ...initialState,
      }
    }

    case acTypes.GET_DOCUMENTS_FAIL: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: false,
        isFail: true,
      }
    }

    default:
      return stateStore
  }
}
