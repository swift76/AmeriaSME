import { AnyAction, Dispatch } from 'redux';
import {
    IGetApplicationsDataReceive,
    IGetApplicationsParams
} from 'app/store/reducers/applications/models';

import { Utils } from 'app/services/utils';
import { applicationActions as actions } from 'app/store/reducers/root-actions';
import axios from 'app/api';
import { toast } from 'react-toastify';

export const getApplications = (params: IGetApplicationsParams) => async (
    dispatch: Dispatch<AnyAction>
) => {
    dispatch(actions.getApplicationsRequest());
    try {
        const response = await axios.get(`/Applications`, { params });
        dispatch(actions.getApplicationsSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(actions.getApplicationsFail(resData));
        return Promise.reject(resData);
    }
};
