import { AnyAction, Dispatch } from 'redux';

import { IApplicationData } from 'app/store/reducers/application/models';
import { Utils } from 'app/services/utils';
import { applicationAction as actions } from 'app/store/reducers/root-actions';
import { applicationActions } from 'app/store/reducers/root-actions';
import axios from 'app/api';
import { toast } from 'react-toastify';

export const getApplication = (id: string) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(actions.getApplicationRequest());
    try {
        const response = await axios.get(`/Applications/${id}`);
        dispatch(actions.getApplicationSuccess(response.data));
        dispatch(
            applicationActions.setApplicationsParams({
                taxIdNumber: response.data.TAX_ID_NUMBER
            })
        );
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(actions.getApplicationFail(resData));
        return Promise.reject(resData);
    }
};

export const getLatestApplication = (taxIdNumber: string) => async (
    dispatch: Dispatch<AnyAction>
) => {
    try {
        const response = await axios.get(
            `/Applications/CustomerLatestApplicationData/${taxIdNumber}`
        );
        dispatch(
            actions.getLatestApplicationSuccess({
                ...response.data,
                TAX_ID_NUMBER: taxIdNumber
            })
        );
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        return Promise.reject(resData);
    }
};

export const saveApplication = (data: IApplicationData) => async (
    dispatch: Dispatch<AnyAction>
) => {
    dispatch(actions.postApplicationRequrest());
    try {
        const response = await axios.post(`/Applications`, data);
        dispatch(actions.postApplicationSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(actions.postApplicationFail());
        return Promise.reject(resData);
    }
};
