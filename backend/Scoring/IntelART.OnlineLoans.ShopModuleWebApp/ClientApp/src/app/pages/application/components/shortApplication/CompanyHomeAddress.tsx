import { Col, Form, Row } from 'react-bootstrap';

import Addresses from 'app/components/Addresses';
import { FormikProps } from 'formik';
import { IApplicationData } from 'app/store/reducers/application/models';
import { IStoreAddresses } from 'app/store/reducers/directory/addresses/initialState';
import React from 'react';

export interface ICompanyHomeAddressProps extends FormikProps<IApplicationData> {
    title?: string;
    addresses: IStoreAddresses;
    getCities: (stateCode: string) => Promise<any>;
}

const CompanyHomeAddress: React.FC<ICompanyHomeAddressProps> = React.memo(props => {
    return (
        <fieldset className="loan-form-group">
            <legend>{props.title}</legend>
            <Addresses {...props} prefix="CURRENT" />
        </fieldset>
    );
});

export default CompanyHomeAddress;
