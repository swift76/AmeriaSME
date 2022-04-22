import {
    IGetMainApplicationData,
    IPostMainApplicationData
} from 'app/store/reducers/mainApplication/models';

import { IGetScoringResultsDataReceive } from 'app/store/reducers/scoringResults/models';
import _ from 'lodash';

export const mapDataToServer = (values: IPostMainApplicationData) => {
    const newValues = _.clone(values);
    return _.each(newValues, (val, key) => modifyPostValues(key, newValues));
};

export const mapDataFromServer = (values: IGetScoringResultsDataReceive) => {
    const newValues = _.clone(values);
    return _.each(newValues, (val, key) => modifyGetValues(key, newValues));
};

const modifyPostValues = (key: string, values: IPostMainApplicationData) => {
    switch (key) {
        case 'MOBILE_PHONE':
            values[key] = values[key].replace(/([+]\d{3})?\s/g, '');
            break;
        case 'INITIAL_AMOUNT':
        case 'ANNUAL_TURNOVER':
            values[key] = Number(String(values[key]));
            break;
        default:
            break;
    }
};

const modifyGetValues = (key: string, values: IGetScoringResultsDataReceive) => {
    switch (key) {
        default:
            values[key] = values[key] === null ? '' : values[key];
            break;
    }
};
