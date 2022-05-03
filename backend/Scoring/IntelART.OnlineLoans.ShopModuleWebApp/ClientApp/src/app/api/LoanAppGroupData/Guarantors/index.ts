import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { loanAppGroupDataActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { guarantors } = loanAppGroupDataActions;

export const getGuarantors = (id: string) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(guarantors.getGuarantorsRequest());
    try {
        const response = await axios.get(`/ApplicationGroupData/ApplicationGuarantors/${id}`);
        dispatch(guarantors.getGuarantorsSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(guarantors.getGuarantorsFail(resData));
        return Promise.reject(resData);
    }
};
