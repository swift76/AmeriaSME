import { IGetRequestError, ISelectDataReceive } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getPledgeTypesRequest = () => {
    return action(acTypes.GET_PLEDGE_TYPES_REQUEST);
};

export const getPledgeTypesSuccess = (data: ISelectDataReceive[]) => {
    return action(acTypes.GET_PLEDGE_TYPES_SUCCESS, data);
};

export const getPledgeTypesFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_PLEDGE_TYPES_FAIL, data);
};
