import { IGetRequestError, IAppCompanyData } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getOpExpensesRequest = () => {
    return action(acTypes.GET_OP_EXPENSES_REQUEST);
};

export const getOpExpensesSuccess = (data: IAppCompanyData[]) => {
    return action(acTypes.GET_OP_EXPENSES_SUCCESS, data);
};

export const getOpExpensesFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_OP_EXPENSES_FAIL, data);
};
