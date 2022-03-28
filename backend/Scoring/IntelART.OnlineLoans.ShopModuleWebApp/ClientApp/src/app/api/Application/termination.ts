import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { toast } from 'react-toastify'

export interface ICanceledPUTData {
  CANCELLATION_REASON_CODE: string;
}

export const cancelApplicaton = async (id: string, data: ICanceledPUTData) => {
  try {
    const response = await axios.put(`/Applications/Cancelled/${id}`, data)
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    return Promise.reject(resData)
  }
}

export const refuseApplication = async (id: string) => {
  try {
    const response = await axios.put(`/Applications/Refused/${id}`)
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    return Promise.reject(resData)
  }
}
