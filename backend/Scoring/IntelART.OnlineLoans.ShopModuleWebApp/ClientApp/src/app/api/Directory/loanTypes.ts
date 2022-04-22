import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { directoryActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { loanTypes } = directoryActions;

export const getLoanTypes = (endpoint: string) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(loanTypes.getLoanTypesRequest());
    try {
        const response = await axios.get(`/Directory/${endpoint}`);
        dispatch(loanTypes.getLoanTypesSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(loanTypes.getLoanTypesFail(resData));
        return Promise.reject(resData);
    }
};
