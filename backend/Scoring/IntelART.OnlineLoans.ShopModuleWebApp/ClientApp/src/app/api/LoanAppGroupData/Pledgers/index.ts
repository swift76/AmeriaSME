import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { loanAppGroupDataActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { pledgers } = loanAppGroupDataActions;

export const getPledgers = (id: string) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(pledgers.getPledgersRequest());
    try {
        const response = await axios.get(`/ApplicationGroupData/ApplicationPledgers/${id}`);
        dispatch(pledgers.getPledgersSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(pledgers.getPledgersFail(resData));
        return Promise.reject(resData);
    }
};
