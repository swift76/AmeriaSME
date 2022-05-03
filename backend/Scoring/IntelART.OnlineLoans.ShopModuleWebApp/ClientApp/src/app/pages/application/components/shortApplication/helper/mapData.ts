import { IApplicationData } from 'app/store/reducers/application/models';
import _ from 'lodash';

export const mapDataToServer = (values: IApplicationData) => {
    const newValues = _.clone(values);
    return _.each(newValues, (val, key) => modifyPostValues(key, newValues));
};

export const mapDataFromServer = (values: IApplicationData, taxId: string) => {
    const newValues = _.clone(values);
    return _.each(newValues, (val, key) => modifyGetValues(key, newValues, taxId));
};

const modifyPostValues = (key: string, values: IApplicationData) => {
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

const modifyGetValues = (key: string, values: IApplicationData, taxId: string) => {
    switch (key) {
        case 'TAX_ID_NUMBER':
            values[key] = values[key] === '' ? taxId : values[key];
            break;
        case 'MOBILE_PHONE':
            values[key] = values[key] ? `+374 ${values[key]}` : '';
            break;
        default:
            values[key] = values[key] === null ? '' : values[key];
            break;
    }
};
