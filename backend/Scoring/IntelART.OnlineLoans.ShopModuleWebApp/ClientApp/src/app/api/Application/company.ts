import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { toast } from 'react-toastify'

export const getCompanyMultipleOwners = async (id: string) => {
  try {
    const response = await axios.get(`/Company/${id}/HasCompanyMultipleOwners`)
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    console.error(error.Message)
    return Promise.reject(resData)
  }
}

export const checkCompanyLLC = async (id: string) => {
  try {
    const response = await axios.get(`/Company/${id}/IsCompanyLLC`)
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    console.error(error.Message)
    return Promise.reject(resData)
  }
}
