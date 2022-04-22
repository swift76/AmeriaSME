import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { directoryActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { pledgeTypes } = directoryActions;

export const getPledgeTypes = () => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(pledgeTypes.getPledgeTypesRequest());
    try {
        const response = await axios.get(`/Directory/PledgeTypes`);
        dispatch(pledgeTypes.getPledgeTypesSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(pledgeTypes.getPledgeTypesFail(resData));
        return Promise.reject(resData);
    }
};
