import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import { companyPhotosActions as actions } from '@store/reducers/root-actions'
import axios from 'app/api'
import { toast } from 'react-toastify'

export const getCompanyPhotos = (id: string) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(actions.getPhotosRequest())
  try {
    const response = await axios.get(`/Applications/${id}/Photos`)
    dispatch(actions.getPhotosSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(actions.getPhotosFail(resData))
    return Promise.reject(resData)
  }
}
