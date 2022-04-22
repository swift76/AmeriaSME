import { IAppCompanyData, IGetRequestError } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getBadMonthEarningsRequest = () => {
    return action(acTypes.GET_BAD_MONTH_EARNINGS_REQUEST);
};

export const getBadMonthEarningsSuccess = (data: IAppCompanyData[]) => {
    return action(acTypes.GET_BAD_MONTH_EARNINGS_SUCCESS, data);
};

export const getBadMonthEarningsFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_BAD_MONTH_EARNINGS_FAIL, data);
};
