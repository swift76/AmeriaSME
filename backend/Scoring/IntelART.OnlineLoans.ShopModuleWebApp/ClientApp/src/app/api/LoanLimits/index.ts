import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { loanLimitsAction } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

export const getLoanLimits = (loanTypeCode: string, currency: string) => async (
    dispatch: Dispatch<AnyAction>
) => {
    dispatch(loanLimitsAction.getLoanLimitsRequest());
    try {
        const response = await axios.get(`/LoanLimits`, {
            params: { loanTypeCode, currency }
        });
        response.data && dispatch(loanLimitsAction.getLoanLimitsSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(loanLimitsAction.getLoanLimitsFetchFail(resData));
        return Promise.reject(resData);
    }
};
