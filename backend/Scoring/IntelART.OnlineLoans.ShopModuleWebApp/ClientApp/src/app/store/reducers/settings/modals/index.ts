import * as AppTypes from 'AppTypes'

import initialState, { IStoreModal } from './initialState'

import acTypes from './acTypes'

export const modal = (
  stateStore: IStoreModal = initialState,
  action: AppTypes.RootAction
): IStoreModal => {
  switch (action.type) {
    case acTypes.OPEN_MODAL: {
      return {
        ...stateStore,
        state: true,
        options: {
          closeButton: true,
          modalProps: {
            backdrop: 'static',
          },
          ...action.payload,
        },
      }
    }

    case acTypes.CLOSE_MODAL: {
      return {
        ...initialState,
        state: false,
      }
    }

    case acTypes.SET_MODAL_OPTIONS: {
      return {
        ...stateStore,
        options: {
          ...stateStore.options,
          ...action.payload,
        },
      }
    }

    default:
      return stateStore
  }
}
