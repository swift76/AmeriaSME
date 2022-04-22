import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { loanAppGroupDataActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { industryTypes } = loanAppGroupDataActions;

export const getIndustryTypes = () => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(industryTypes.getIndustryTypesRequest());
    try {
        const response = await axios.get(`ApplicationGroupData/IndustryTypes`);
        dispatch(industryTypes.getIndustryTypesSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(industryTypes.getIndustryTypesFail(resData));
        return Promise.reject(resData);
    }
};
