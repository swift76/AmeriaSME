import { IGetRequestError, ISelectDataReceive } from 'app/store/reducers/common-models';

import acTypes from './acTypes';
import { action } from 'typesafe-actions';

export const getAddressCountriesRequest = () => {
    return action(acTypes.GET_ADDRESS_COUNTRIES_REQUEST);
};

export const getAddressCountriesSuccess = (data: ISelectDataReceive[]) => {
    return action(acTypes.GET_ADDRESS_COUNTRIES_SUCCESS, data);
};

export const getAddressCountriesFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_ADDRESS_COUNTRIES_FAIL, data);
};

export const getStatesRequest = () => {
    return action(acTypes.GET_STATES_REQUEST);
};

export const getStatesSuccess = (data: ISelectDataReceive[]) => {
    return action(acTypes.GET_STATES_SUCCESS, data);
};

export const getStatesFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_STATES_FAIL, data);
};

export const getCitiesRequest = () => {
    return action(acTypes.GET_CITIES_REQUEST);
};

export const getCitiesSuccess = (data: ISelectDataReceive[], stateCode: string) => {
    return action(acTypes.GET_CITIES_SUCCESS, {
        [stateCode]: data
    });
};

export const getCitiesFail = (data: IGetRequestError[]) => {
    return action(acTypes.GET_CITIES_FAIL, data);
};
