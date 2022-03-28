import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { directoryActions } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

const { activities } = directoryActions

export const getActivities = () => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(activities.getActivitiesRequest())
  try {
    const response = await axios.get(`/Directory/Activities`)
    dispatch(activities.getActivitiesSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(activities.getActivitiesFail(resData))
    return Promise.reject(resData)
  }
}
