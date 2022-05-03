import { Col, Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

import { FormikProps } from 'formik';
import { IApplicationData } from 'app/store/reducers/application/models';
import { IStoreAddresses } from 'app/store/reducers/directory/addresses/initialState';

export interface IAddressesProps extends FormikProps<IApplicationData> {
    addresses: IStoreAddresses;
    getCities: (stateCode: string) => Promise<any>;
    prefix: string;
}

const Addresses: React.FC<IAddressesProps> = (props: IAddressesProps) => {
    const {
        addresses,
        getCities,
        prefix,
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        setFieldTouched
    } = props;

    const { addressCountries, states, cities } = addresses;

    const countryName = `${prefix}_COUNTRY_CODE`;
    const stateName = `${prefix}_STATE_CODE`;
    const citiesName = `${prefix}_CITY_CODE`;
    const streetName = `${prefix}_STREET`;
    const buildName = `${prefix}_BUILDNUM`;
    const appartmentName = `${prefix}_APARTMENT`;
    const isSameAddressName = `IS_${prefix}_ADDRESS_SAME`;

    const isSameAddress = values[isSameAddressName];
    const stringErrors = errors as any;

    const handleChangeState = async (e: any) => {
        const value = e.currentTarget.value;
        await handleChange(e);
        if (!cities.data[value] && value) {
            getCities(value);
        }
    };

    const resetFieldsValidation = () => {
        setFieldTouched(`${countryName}`, false);
        setFieldTouched(`${stateName}`, false);
        setFieldTouched(`${citiesName}`, false);
        setFieldTouched(`${streetName}`, false);
        setFieldTouched(`${buildName}`, false);
        setFieldTouched(`${appartmentName}`, false);
    };

    const resetFieldsValue = () => {
        setFieldValue(`${countryName}`, '');
        setFieldValue(`${stateName}`, '');
        setFieldValue(`${citiesName}`, '');
        setFieldValue(`${streetName}`, '');
        setFieldValue(`${buildName}`, '');
        setFieldValue(`${appartmentName}`, '');
        resetFieldsValidation();
    };

    const handleChangeSameAddress = async (e: any) => {
        if (e.target.checked) {
            resetFieldsValue();
        }
        setFieldValue(e.target.name, e.target.checked);
    };

    return (
        <>
            <Form.Group className="bg-transparent" controlId={isSameAddressName}>
                <Form.Check
                    type="checkbox"
                    label="Գրանցման և փաստացի հասցեները նույնն են"
                    name={isSameAddressName}
                    id={`${isSameAddressName}`}
                    value={isSameAddress || ''}
                    checked={!!isSameAddress}
                    onChange={handleChangeSameAddress}
                    isInvalid={
                        !isSameAddress && touched[isSameAddressName] && !!errors[isSameAddressName]
                    }
                />
            </Form.Group>
            <fieldset disabled={isSameAddress} className="loan-form-group">
                <Form.Group controlId="formAddressCountries" as={Row}>
                    <Form.Label column={true} sm={5}>
                        Երկիր
                    </Form.Label>
                    <Col sm={7}>
                        <Form.Control
                            name={countryName}
                            as={'select'}
                            value={values[countryName] || ''}
                            isInvalid={
                                !isSameAddress && touched[countryName] && !!errors[countryName]
                            }
                            onChange={handleChange}
                        >
                            <option value="">Ընտրել</option>
                            {addressCountries.data.map(address => (
                                <option key={address.CODE} value={address.CODE}>
                                    {address.NAME}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {stringErrors[countryName]}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group controlId={stateName} as={Row}>
                    <Form.Label column={true} sm={5}>
                        Մարզ
                    </Form.Label>
                    <Col sm={7}>
                        <Form.Control
                            as={'select'}
                            name={stateName}
                            value={values[stateName] || ''}
                            isInvalid={!isSameAddress && touched[stateName] && !!errors[stateName]}
                            onChange={handleChangeState}
                        >
                            <option value="">Ընտրել</option>
                            {states.data.map(state => (
                                <option key={state.CODE} value={state.CODE}>
                                    {state.NAME}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {stringErrors[stateName]}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group controlId={citiesName} as={Row}>
                    <Form.Label column={true} sm={5}>
                        Բնակավայր
                    </Form.Label>
                    <Col sm={7}>
                        <Form.Control
                            name={citiesName}
                            as={'select'}
                            value={values[citiesName] || ''}
                            isInvalid={
                                !isSameAddress && touched[citiesName] && !!errors[citiesName]
                            }
                            onChange={handleChange}
                        >
                            <option value="">Ընտրել</option>
                            {values[stateName] &&
                                cities.data[values[stateName]] &&
                                cities.data[values[stateName]].map(state => (
                                    <option key={state.CODE} value={state.CODE}>
                                        {state.NAME}
                                    </option>
                                ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {stringErrors[citiesName]}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group controlId={streetName} as={Row}>
                    <Form.Label column={true} sm={5}>
                        Փողոց
                    </Form.Label>
                    <Col sm={7}>
                        <Form.Control
                            type="text"
                            name={streetName}
                            value={values[streetName] || ''}
                            // isValid={
                            //   !isSameAddress && touched[streetName] && !errors[streetName]
                            // }
                            isInvalid={
                                !isSameAddress && touched[streetName] && !!errors[streetName]
                            }
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            {stringErrors[streetName]}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group controlId={buildName} as={Row}>
                    <Form.Label column={true} sm={5}>
                        Տուն / Շենք
                    </Form.Label>
                    <Col sm={3}>
                        <Form.Control
                            name={buildName}
                            type="text"
                            value={values[buildName] || ''}
                            // isValid={
                            //   !isSameAddress && touched[buildName] && !errors[buildName]
                            // }
                            isInvalid={!isSameAddress && touched[buildName] && !!errors[buildName]}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            {stringErrors[buildName]}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group controlId="formApartmentNumber" as={Row}>
                    <Form.Label column={true} sm={5}>
                        Բնակարան
                    </Form.Label>
                    <Col sm={3}>
                        <Form.Control
                            name={appartmentName}
                            type="text"
                            value={values[appartmentName] || ''}
                            // isValid={
                            //   !isSameAddress &&
                            //   touched[appartmentName] &&
                            //   !errors[appartmentName]
                            // }
                            isInvalid={
                                !isSameAddress &&
                                touched[appartmentName] &&
                                !!errors[appartmentName]
                            }
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            {stringErrors[appartmentName]}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
            </fieldset>
        </>
    );
};

export default Addresses;
