import { IAppCompanyData, IGetRequestError } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getGoodMonthEarningsRequest = () => {
    return action(acTypes.GET_GOOD_MONTH_EARNINGS_REQUEST);
};

export const getGoodMonthEarningsSuccess = (data: IAppCompanyData[]) => {
    return action(acTypes.GET_GOOD_MONTH_EARNINGS_SUCCESS, data);
};

export const getGoodMonthEarningsFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_GOOD_MONTH_EARNINGS_FAIL, data);
};
