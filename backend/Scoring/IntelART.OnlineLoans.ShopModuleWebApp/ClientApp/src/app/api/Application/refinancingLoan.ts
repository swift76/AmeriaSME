import { IRefinancingLoansData } from '@app/store/reducers/mainApplication/models'
import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { toast } from 'react-toastify'

export const getRefinansingLoan = async (id: string) => {
  try {
    const response = await axios.get(`/RefinancingLoan/${id}`)
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    return Promise.reject(resData)
  }
}

export const postRefinansingLoan = async (
  id: string,
  data: IRefinancingLoansData[]
) => {
  try {
    const response = await axios.post(`/RefinancingLoan/${id}`, data)
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    return Promise.reject(resData)
  }
}
