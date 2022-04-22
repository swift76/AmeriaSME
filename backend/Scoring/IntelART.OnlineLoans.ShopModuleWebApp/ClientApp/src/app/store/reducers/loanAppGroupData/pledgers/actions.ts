import { IAppRelatedPersons, IGetRequestError } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getPledgersRequest = () => {
    return action(acTypes.GET_PLEDGERS_REQUEST);
};

export const getPledgersSuccess = (data: IAppRelatedPersons[]) => {
    return action(acTypes.GET_PLEDGERS_SUCCESS, data);
};

export const getPledgersFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_PLEDGERS_FAIL, data);
};
