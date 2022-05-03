import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { directoryActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { cancelReasons } = directoryActions;

export const getCancelReasons = () => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(cancelReasons.getCancelReasonsRequest());
    try {
        const response = await axios.get(`/Directory/CancellationReasons`);
        dispatch(cancelReasons.getCancelReasonsSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(cancelReasons.getCancelReasonsFail(resData));
        return Promise.reject(resData);
    }
};
