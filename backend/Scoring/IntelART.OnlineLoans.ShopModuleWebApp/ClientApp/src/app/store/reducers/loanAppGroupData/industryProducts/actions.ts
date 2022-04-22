import { IGetRequestError, ISelectDataReceive } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getIndustryProductsRequest = () => {
    return action(acTypes.GET_INDUSTRY_PRODUCTS_REQUEST);
};

export const getIndustryProductsSuccess = (data: ISelectDataReceive[]) => {
    return action(acTypes.GET_INDUSTRY_PRODUCTS_SUCCESS, data);
};

export const getIndustryProductsFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_INDUSTRY_PRODUCTS_FAIL, data);
};
