import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { loanAppGroupDataActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { otherStatistics } = loanAppGroupDataActions;

export const getOtherStatistics = (id: string) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(otherStatistics.getOtherStatisticsRequest());
    try {
        const response = await axios.get(`/ApplicationGroupData/CompanyOtherStatistics/${id}`);
        dispatch(otherStatistics.getOtherStatisticsSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(otherStatistics.getOtherStatisticsFail(resData));
        return Promise.reject(resData);
    }
};
