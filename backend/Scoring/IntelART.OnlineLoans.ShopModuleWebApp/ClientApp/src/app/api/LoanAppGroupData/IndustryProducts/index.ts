import { AnyAction, Dispatch } from 'redux'

import { Utils } from 'app/services/utils'
import axios from 'app/api'
import { loanAppGroupDataActions } from '@store/reducers/root-actions'
import { toast } from 'react-toastify'

const { industryProducts } = loanAppGroupDataActions

export const getIndustryProducts = () => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(industryProducts.getIndustryProductsRequest())
  try {
    const response = await axios.get(`ApplicationGroupData/IndustryProducts`)
    dispatch(industryProducts.getIndustryProductsSuccess(response.data))
    return response.data
  } catch (error) {
    const resData = error && error.response && error.response.data
    toast.error(Utils.localizedServerErrors(resData.Message))
    dispatch(industryProducts.getIndustryProductsFail(resData))
    return Promise.reject(resData)
  }
}
