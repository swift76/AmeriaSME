import { AnyAction, Dispatch } from 'redux'
import {
  IPreApprovedResultsData,
  IPreApprovedResultsPostData,
} from '@store/reducers/preapprovedResults/models'

import { Utils } from 'app/services/utils'
import { preapprovedResultsActions as actions } from '@store/reducers/root-actions'
import axios from 'app/api'
import { toast } from 'react-toastify'

export const getPreApprovedResults = (id: string) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(actions.getPreApprovedResultsRequest())
  try {
    const response = await axios.get(`/Applications/${id}/PreapprovedResult`)
    dispatch(actions.getPreApprovedResultsSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(actions.getPreApprovedResultsFail(resData))
    return Promise.reject(resData)
  }
}

export const savePreApprovedResult = (
  id: string,
  data: IPreApprovedResultsPostData
) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(actions.postPreApprovedResultsRequest())
  try {
    const response = await axios.post(
      `/Applications/${id}/PreapprovedResult`,
      data
    )
    dispatch(actions.postPreApprovedResultsSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(actions.postPreApprovedResultsFail())
    return Promise.reject(resData)
  }
}
