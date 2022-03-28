import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { directoryActions } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

const { addresses } = directoryActions

export const getAddressCountries = () => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(addresses.getAddressCountriesRequest())
  try {
    const response = await axios.get(`Directory/AddressCountries`)
    dispatch(addresses.getAddressCountriesSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(addresses.getAddressCountriesFail(resData))
    return Promise.reject(resData)
  }
}

export const getStates = () => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(addresses.getStatesRequest())
  try {
    const response = await axios.get(`Directory/States`)
    dispatch(addresses.getStatesSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(addresses.getStatesFail(resData))
    return Promise.reject(resData)
  }
}

export const getCities = (stateCode: string) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(addresses.getCitiesRequest())
  try {
    const response = await axios.get(`Directory/States/${stateCode}/Cities`)
    dispatch(addresses.getCitiesSuccess(response.data, stateCode))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(addresses.getCitiesFail(resData))
    return Promise.reject(resData)
  }
}
