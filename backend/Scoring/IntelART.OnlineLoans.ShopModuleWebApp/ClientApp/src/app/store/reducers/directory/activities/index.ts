import * as AppTypes from 'AppTypes'

import initialState, { IStoreActivities } from './initialState'

import acTypes from './acTypes'

export const activities = (
  stateStore: IStoreActivities = initialState,
  action: AppTypes.RootAction
): IStoreActivities => {
  switch (action.type) {
    case acTypes.GET_ACTIVITIES_REQUEST: {
      return {
        ...stateStore,
        activitiesIsLoading: true,
        activitiesLoaded: false,
      }
    }

    case acTypes.GET_ACTIVITIES_SUCCESS: {
      return {
        ...stateStore,
        activitiesIsLoading: false,
        activitiesLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_ACTIVITIES_FAIL: {
      return {
        ...stateStore,
        activitiesIsLoading: false,
        activitiesLoaded: false,
        activitiesFetchFail: true,
      }
    }

    default:
      return stateStore
  }
}
