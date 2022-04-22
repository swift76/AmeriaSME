import { IAppRelatedPersons, IGetRequestError } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getGuarantorsRequest = () => {
    return action(acTypes.GET_GUARANTORS_REQUEST);
};

export const getGuarantorsSuccess = (data: IAppRelatedPersons[]) => {
    return action(acTypes.GET_GUARANTORS_SUCCESS, data);
};

export const getGuarantorsFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_GUARANTORS_FAIL, data);
};
