import * as AppTypes from 'AppTypes'

import initialState, { IStoreCompanyPhotos } from './initialState'

import _ from 'lodash'
import acTypes from './acTypes'

export const companyPhotos = (
  stateStore: IStoreCompanyPhotos = initialState,
  action: AppTypes.RootAction
): IStoreCompanyPhotos => {
  switch (action.type) {
    case acTypes.GET_PHOTOS_REQUEST: {
      return {
        ...stateStore,
        isLoading: true,
        isLoaded: false,
      }
    }

    case acTypes.GET_PHOTOS_SUCCESS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        isFail: false,
        data: action.payload,
      }
    }

    case acTypes.RESET_PHOTOS: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        isFail: false,
      }
    }

    case acTypes.SET_NEW_PHOTO: {
      return {
        ...stateStore,
        isLoading: false,
        isLoaded: true,
        isFail: false,
        data: [...stateStore.data, action.payload],
      }
    }

    case acTypes.REMOVE_PHOTO: {
      return {
        ...stateStore,
        data: stateStore.data.filter(photo => photo.ID !== action.payload),
      }
    }

    case acTypes.SET_PHOTOS_COUNT: {
      const { count, pledge } = action.payload
      return {
        ...stateStore,
        ...(pledge ? { pledgeCount: count } : { nonPledgeCount: count }),
      }
    }

    case acTypes.GET_PHOTOS_FAIL: {
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
