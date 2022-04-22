import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { loanAppGroupDataActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { nonOpExpenses } = loanAppGroupDataActions;

export const getNonOpExpanses = (id: string) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(nonOpExpenses.getNonOpExpensesRequest());
    try {
        const response = await axios.get(
            `/ApplicationGroupData/CompanyNonOperationalExpenses/${id}`
        );
        dispatch(nonOpExpenses.getNonOpExpensesSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(nonOpExpenses.getNonOpExpensesFail(resData));
        return Promise.reject(resData);
    }
};
