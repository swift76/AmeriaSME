import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import { scoringResults as actions } from 'app/store/reducers/root-actions';
import axios from 'app/api';
import { toast } from 'react-toastify';

export const getScoringResults = (id: string) => async (
    dispatch: Dispatch<AnyAction>,
    getState: any
) => {
    dispatch(actions.getScoringResultsRequest());
    try {
        const response = await axios.get(`/Applications/${id}/ScoringResults`);
        dispatch(actions.getScoringResultsSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(actions.getScoringResultsFetchFail(resData));
        return Promise.reject(resData);
    }
};
