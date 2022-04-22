import { AnyAction, Dispatch } from 'redux';

import { IPostMainApplicationData } from 'app/store/reducers/mainApplication/models';
import { Utils } from 'app/services/utils';
import { mainApplicationAction as actions } from 'app/store/reducers/root-actions';
import axios from 'app/api';
import { toast } from 'react-toastify';

export const getMainApplication = (id: string) => async (
    dispatch: Dispatch<AnyAction>,
    getState: any
) => {
    dispatch(actions.getMainApplicationRequest());
    try {
        const response = await axios.get(`/Applications/${id}/Main`);
        dispatch(actions.getMainApplicationSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(actions.getMainApplicationFail(resData));
        return Promise.reject(resData);
    }
};

export const saveMainApplication = (id: string, data: IPostMainApplicationData) => async (
    dispatch: Dispatch<AnyAction>
) => {
    dispatch(actions.postMainApplicationRequrest());
    try {
        const response = await axios.post(`/Applications/${id}/Main`, data);
        dispatch(actions.postMainApplicationSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(actions.postMainApplicationFail());
        return Promise.reject(resData);
    }
};
