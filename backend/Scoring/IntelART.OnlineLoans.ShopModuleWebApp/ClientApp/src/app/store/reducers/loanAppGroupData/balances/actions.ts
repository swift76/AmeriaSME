import { IGetRequestError, IAppCompanyData } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getBalancesRequest = () => {
    return action(acTypes.GET_BALANCES_REQUEST);
};

export const getBalancesSuccess = (data: IAppCompanyData[]) => {
    return action(acTypes.GET_BALANCES_SUCCESS, data);
};

export const getBalancesFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_BALANCES_FAIL, data);
};
