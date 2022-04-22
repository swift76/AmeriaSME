import { IGetRequestError, ISelectDataReceive } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getLoanTypesRequest = () => {
    return action(acTypes.GET_LOAN_TYPES_REQUEST);
};

export const getLoanTypesSuccess = (data: ISelectDataReceive[]) => {
    return action(acTypes.GET_LOAN_TYPES_SUCCESS, data);
};

export const getLoanTypesFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_LOAN_TYPES_FAIL, data);
};
