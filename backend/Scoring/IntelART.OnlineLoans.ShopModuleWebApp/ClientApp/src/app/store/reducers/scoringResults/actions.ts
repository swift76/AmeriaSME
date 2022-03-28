import { IGetRequestError } from '../common-models'
import { IGetScoringResultsDataReceive } from './models'
import acTypes from './acTypes'
import { action } from 'typesafe-actions'

/*************************************************************************
 * GET APPLICATION Scroing ACTION CREATORS
 *************************************************************************/
export const getScoringResultsRequest = () => {
  return action(acTypes.GET_SCORING_RESULTS_REQUEST)
}

export const getScoringResultsSuccess = (
  data: IGetScoringResultsDataReceive[]
) => {
  return action(acTypes.GET_SCORING_RESULTS_SUCCESS, data)
}

export const getScoringResultsFetchFail = (data: IGetRequestError) => {
  return action(acTypes.GET_SCORING_RESULTS_FAIL, data)
}

export const resetScoringResults = () => {
  return action(acTypes.RESET_SCORING_RESULTS)
}
