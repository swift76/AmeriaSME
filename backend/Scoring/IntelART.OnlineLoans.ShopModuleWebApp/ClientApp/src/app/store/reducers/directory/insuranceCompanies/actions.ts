import { IGetRequestError, ISelectDataReceive } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getInsuranceCompaniesRequest = () => {
    return action(acTypes.GET_INSURANCE_COMPANIES_REQUEST);
};

export const getInsuranceCompaniesSuccess = (data: ISelectDataReceive[]) => {
    return action(acTypes.GET_INSURANCE_COMPANIES_SUCCESS, data);
};

export const getInsuranceCompaniesFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_INSURANCE_COMPANIES_FAIL, data);
};
