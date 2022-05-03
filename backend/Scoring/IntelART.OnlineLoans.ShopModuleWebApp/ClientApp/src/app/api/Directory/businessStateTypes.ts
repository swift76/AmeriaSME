import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { directoryActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { businessStateTypes } = directoryActions;

export const getBusinessStateTypes = (id: string) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(businessStateTypes.getBusinessStateTypesRequest());
    try {
        const response = await axios.get(`/Directory/BusinessStateTypes/`, {
            params: { id }
        });
        dispatch(businessStateTypes.getBusinessStateTypesSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(businessStateTypes.getBusinessStateTypesFail(resData));
        return Promise.reject(resData);
    }
};
