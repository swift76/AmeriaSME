import { IGetRequestError, IAppCompanyData } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getNonOpExpensesRequest = () => {
    return action(acTypes.GET_NON_OP_EXPENSES_REQUEST);
};

export const getNonOpExpensesSuccess = (data: IAppCompanyData[]) => {
    return action(acTypes.GET_NON_OP_EXPENSES_SUCCESS, data);
};

export const getNonOpExpensesFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_NON_OP_EXPENSES_FAIL, data);
};
