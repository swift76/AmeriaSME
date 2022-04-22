import { IGetRequestError, ISelectDataReceive } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getCancelReasonsRequest = () => {
    return action(acTypes.GET_CANCELREASONS_REQUEST);
};

export const getCancelReasonsSuccess = (data: ISelectDataReceive[]) => {
    return action(acTypes.GET_CANCELREASONS_SUCCESS, data);
};

export const getCancelReasonsFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_CANCELREASONS_FAIL, data);
};
