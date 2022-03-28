import * as AppTypes from 'AppTypes'

import initialState, { IStoreScoring } from './initialState'

import acTypes from './acTypes'

export const scoringResults = (
  stateStore: IStoreScoring = initialState,
  action: AppTypes.RootAction
): IStoreScoring => {
  switch (action.type) {
    case acTypes.GET_SCORING_RESULTS_REQUEST: {
      return {
        ...stateStore,
        scoringIsLoading: true,
        scoringLoaded: false,
      }
    }

    case acTypes.GET_SCORING_RESULTS_SUCCESS: {
      return {
        ...stateStore,
        scoringIsLoading: false,
        scoringLoaded: true,
        data: [...action.payload],
      }
    }

    case acTypes.GET_SCORING_RESULTS_FAIL: {
      return {
        ...stateStore,
        scoringIsLoading: false,
        scoringLoaded: false,
        scoringFetchFail: true,
        data: initialState.data,
      }
    }

    case acTypes.RESET_SCORING_RESULTS: {
      return {
        ...stateStore,
        data: initialState.data,
      }
    }

    default:
      return stateStore
  }
}
