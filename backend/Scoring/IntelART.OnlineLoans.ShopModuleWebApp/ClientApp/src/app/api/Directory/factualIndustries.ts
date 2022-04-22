import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { directoryActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { industires } = directoryActions;

export const getIndustries = () => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(industires.getFactualIndustriesRequest());
    try {
        const response = await axios.get(`/Directory/FactualIndustries`);
        dispatch(industires.getFactualIndustriesSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(industires.getFactualIndustriesFail(resData));
        return Promise.reject(resData);
    }
};
