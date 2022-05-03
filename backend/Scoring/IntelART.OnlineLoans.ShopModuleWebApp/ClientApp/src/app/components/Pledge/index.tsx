// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Col, Form, Row, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { getAppraisalCompanies, getInsuranceCompanies, getPledgeTypes } from 'app/api/Directory';
import { useDispatch, useSelector } from 'react-redux';

import AppRelatedPersons from '../RelatedPersons';
import DatePicker from 'react-datepicker';
import DocumentUploader from '../DocumentUploader';
import { FormikProps } from 'formik';
import { ILoanSpecApplicationData } from 'app/store/reducers/loanSpecApplication/models';
import NumberFormat from 'react-number-format';
import { ReducerState } from 'AppTypes';
import { Utils } from 'app/services/utils';
import _ from 'lodash';
import clsx from 'clsx';
import { getDocuments } from 'app/api/Documents';
import moment from 'moment';

export interface IPledgeProps {
    id: string;
}

const Pledge: React.FC<IPledgeProps & FormikProps<ILoanSpecApplicationData>> = props => {
    const { id, values, handleChange, errors, touched, setFieldValue } = props;
    const [pledgePercent, setPledgePercent] = useState(0);
    const dispatch = useDispatch();

    const pledgers = useSelector(({ loanAppGroupData }: ReducerState) => loanAppGroupData.pledgers);
    const pledgeTypes = useSelector(({ directory }: ReducerState) => directory.pledgeTypes);
    const appraisalCompanies = useSelector(
        ({ directory }: ReducerState) => directory.appraisalCompanies
    );
    const insuranceCompanies = useSelector(
        ({ directory }: ReducerState) => directory.insuranceCompanies
    );
    const documents = useSelector((state: ReducerState) => state.documents);

    useEffect(() => {
        const { LS_LOAN_AMOUNT, LIQUID_PRICE } = values;
        if (!!LIQUID_PRICE) {
            const percent = Math.floor(Number(LS_LOAN_AMOUNT) / Number(LIQUID_PRICE));
            setPledgePercent(percent);
        }
    }, [values.LS_LOAN_AMOUNT, values.LIQUID_PRICE]);

    useEffect(() => {
        !appraisalCompanies.isLoaded && dispatch(getAppraisalCompanies());
        !pledgeTypes.loanTypesLoaded && dispatch(getPledgeTypes());
        !insuranceCompanies.industiresLoaded && dispatch(getInsuranceCompanies());
        !documents.isLoaded && dispatch(getDocuments(id));
    }, []);

    return (
        <div className={`adv-loan-section`} id="applicationPledgers">
            <h5 className="adv-loan-title">Գրավ</h5>
            <Table striped={true} borderless={true} className="adv-loan-table">
                <tbody>
                    <tr>
                        <td>Ապահովման միջոց գրավի տեսակ</td>
                        <td colSpan={2}>
                            <Form.Check
                                id="IS_REAL_ESTATE"
                                inline={true}
                                name={'IS_REAL_ESTATE'}
                                value="true"
                                label="Անշարժ գույք"
                                type="radio"
                                checked={values.IS_REAL_ESTATE === true}
                                onChange={() => setFieldValue('IS_REAL_ESTATE', true)}
                                isInvalid={touched.IS_REAL_ESTATE && !!errors.IS_REAL_ESTATE}
                            />
                            <Form.Check
                                inline={true}
                                name={'IS_REAL_ESTATE'}
                                value="false"
                                checked={values.IS_REAL_ESTATE === false}
                                label="Տրանսպորտային միջոց"
                                type="radio"
                                onChange={() => setFieldValue('IS_REAL_ESTATE', false)}
                                isInvalid={touched.IS_REAL_ESTATE && !!errors.IS_REAL_ESTATE}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Կնքվում է հիմնական պայմանագիր</td>
                        <td colSpan={2}>
                            <Form.Check
                                inline={true}
                                name={'SHOULD_MAIN_AGREEMENT_SIGNED'}
                                value="true"
                                label="Այո"
                                type="radio"
                                checked={values.SHOULD_MAIN_AGREEMENT_SIGNED}
                                onChange={() => setFieldValue('SHOULD_MAIN_AGREEMENT_SIGNED', true)}
                                isInvalid={
                                    touched.SHOULD_MAIN_AGREEMENT_SIGNED &&
                                    !!errors.SHOULD_MAIN_AGREEMENT_SIGNED
                                }
                            />
                            <Form.Check
                                inline={true}
                                name={'SHOULD_MAIN_AGREEMENT_SIGNED'}
                                value="false"
                                checked={!values.SHOULD_MAIN_AGREEMENT_SIGNED}
                                label="Ոչ"
                                type="radio"
                                onChange={() =>
                                    setFieldValue('SHOULD_MAIN_AGREEMENT_SIGNED', false)
                                }
                                isInvalid={
                                    touched.SHOULD_MAIN_AGREEMENT_SIGNED &&
                                    !!errors.SHOULD_MAIN_AGREEMENT_SIGNED
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Կնքվում է հիմնական պայմանագրի ներքո</td>
                        <td colSpan={2}>
                            <Form.Check
                                inline={true}
                                name={'IS_MAIN_AGREEMENT_SIGNED'}
                                value="true"
                                label="Այո"
                                type="radio"
                                checked={values.IS_MAIN_AGREEMENT_SIGNED}
                                onChange={() => setFieldValue('IS_MAIN_AGREEMENT_SIGNED', true)}
                                isInvalid={
                                    touched.IS_MAIN_AGREEMENT_SIGNED &&
                                    !!errors.IS_MAIN_AGREEMENT_SIGNED
                                }
                            />
                            <Form.Check
                                inline={true}
                                name={'IS_MAIN_AGREEMENT_SIGNED'}
                                value="false"
                                checked={!values.IS_MAIN_AGREEMENT_SIGNED}
                                label="Ոչ"
                                type="radio"
                                onChange={() => setFieldValue('IS_MAIN_AGREEMENT_SIGNED', false)}
                                isInvalid={
                                    touched.IS_MAIN_AGREEMENT_SIGNED &&
                                    !!errors.IS_MAIN_AGREEMENT_SIGNED
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Հաջորդող գրավադրում</td>
                        <td colSpan={2}>
                            <Form.Check
                                inline={true}
                                name={'IS_SUCCESSIVE_PLEDGING'}
                                value="true"
                                label="Այո"
                                type="radio"
                                checked={values.IS_SUCCESSIVE_PLEDGING}
                                onChange={() => setFieldValue('IS_SUCCESSIVE_PLEDGING', true)}
                                isInvalid={
                                    touched.IS_SUCCESSIVE_PLEDGING &&
                                    !!errors.IS_SUCCESSIVE_PLEDGING
                                }
                            />
                            <Form.Check
                                inline={true}
                                name={'IS_SUCCESSIVE_PLEDGING'}
                                value="false"
                                checked={!values.IS_SUCCESSIVE_PLEDGING}
                                label="Ոչ"
                                type="radio"
                                onChange={() => setFieldValue('IS_SUCCESSIVE_PLEDGING', false)}
                                isInvalid={
                                    touched.IS_SUCCESSIVE_PLEDGING &&
                                    !!errors.IS_SUCCESSIVE_PLEDGING
                                }
                            />
                        </td>
                    </tr>
                </tbody>

                <AppRelatedPersons
                    title="Գրավատու"
                    rowName="Գրավատու"
                    dataName="PLEDGERS"
                    loading={pledgers.isLoading}
                    {...props}
                />

                <tbody>
                    <tr>
                        <td>
                            <Form.Label htmlFor="MARKET_PRICE">Գրավի շուկայական արժեք</Form.Label>
                        </td>
                        <td colSpan={2}>
                            <Form.Group controlId="MARKET_PRICE" as={Row}>
                                <NumberFormat
                                    thousandSeparator={true}
                                    onChange={Utils.formatInputValue(handleChange, {
                                        replace: /[(\,)\s]/g
                                    })}
                                    onFocus={() => {
                                        values.MARKET_PRICE === 0 &&
                                            setFieldValue('MARKET_PRICE', '');
                                    }}
                                    name="MARKET_PRICE"
                                    value={String(values.MARKET_PRICE)}
                                    customInput={Form.Control}
                                    className={clsx('control-150', {
                                        'is-valid': touched.MARKET_PRICE && !errors.MARKET_PRICE,
                                        'is-invalid': touched.MARKET_PRICE && !!errors.MARKET_PRICE
                                    })}
                                />
                                <span className="form-label col-form-label ml-1">դրամ</span>
                                <Form.Control.Feedback type="invalid">
                                    {errors.MARKET_PRICE}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <Form.Label htmlFor="LIQUID_PRICE">Գրավի լիկվիդային արժեք</Form.Label>
                        </td>
                        <td colSpan={2}>
                            <Form.Group controlId="LIQUID_PRICE" as={Row}>
                                <NumberFormat
                                    type="text"
                                    thousandSeparator={true}
                                    onChange={Utils.formatInputValue(handleChange, {
                                        replace: /[(\,)\s]/g
                                    })}
                                    onFocus={() => {
                                        values.LIQUID_PRICE === 0 &&
                                            setFieldValue('LIQUID_PRICE', '');
                                    }}
                                    name="LIQUID_PRICE"
                                    value={values.LIQUID_PRICE}
                                    customInput={Form.Control}
                                    className={clsx('control-150', {
                                        'is-valid': touched.LIQUID_PRICE && !errors.LIQUID_PRICE,
                                        'is-invalid': touched.LIQUID_PRICE && !!errors.LIQUID_PRICE
                                    })}
                                />
                                <span className="form-label col-form-label ml-1">դրամ</span>
                                <Form.Control.Feedback type="invalid">
                                    {errors.LIQUID_PRICE}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </td>
                    </tr>

                    <tr>
                        <td>Ապահովագրության պայման</td>
                        <td colSpan={2}>
                            <Form.Check
                                inline={true}
                                name={'IS_INSURANCE_CONDITION'}
                                value="true"
                                label="Այո"
                                type="radio"
                                checked={values.IS_INSURANCE_CONDITION}
                                onChange={() => setFieldValue('IS_INSURANCE_CONDITION', true)}
                                isInvalid={
                                    touched.IS_INSURANCE_CONDITION &&
                                    !!errors.IS_INSURANCE_CONDITION
                                }
                            />
                            <Form.Check
                                inline={true}
                                name={'IS_INSURANCE_CONDITION'}
                                value="false"
                                checked={!values.IS_INSURANCE_CONDITION}
                                label="Ոչ"
                                type="radio"
                                onChange={() => setFieldValue('IS_INSURANCE_CONDITION', false)}
                                isInvalid={
                                    touched.IS_INSURANCE_CONDITION &&
                                    !!errors.IS_INSURANCE_CONDITION
                                }
                            />
                        </td>
                    </tr>
                    {values.IS_INSURANCE_CONDITION && (
                        <tr>
                            <td>
                                <Form.Label htmlFor="INSURANCE_COMPANY_CODE">
                                    Ապահովագրող կազմակերպություն
                                </Form.Label>
                            </td>
                            <td colSpan={2}>
                                <Form.Group controlId="INSURANCE_COMPANY_CODE" as={Row}>
                                    <Form.Control
                                        as="select"
                                        className="control-150"
                                        name="INSURANCE_COMPANY_CODE"
                                        value={values.INSURANCE_COMPANY_CODE || ''}
                                        onChange={handleChange}
                                        isValid={
                                            touched.INSURANCE_COMPANY_CODE &&
                                            !errors.INSURANCE_COMPANY_CODE
                                        }
                                        isInvalid={
                                            touched.INSURANCE_COMPANY_CODE &&
                                            !!errors.INSURANCE_COMPANY_CODE
                                        }
                                    >
                                        <option value="">Ընտրել</option>
                                        {insuranceCompanies.data.map(company => (
                                            <option key={company.CODE} value={company.CODE}>
                                                {company.NAME}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.INSURANCE_COMPANY_CODE}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td>Ապահովագրությունը բանկի կողմից</td>
                        <td colSpan={2}>
                            <Form.Check
                                inline={true}
                                name={'IS_INSURANCE_BY_BANK'}
                                value="true"
                                label="Այո"
                                type="radio"
                                checked={values.IS_INSURANCE_BY_BANK}
                                onChange={() => setFieldValue('IS_INSURANCE_BY_BANK', true)}
                                isInvalid={
                                    touched.IS_INSURANCE_BY_BANK && !!errors.IS_INSURANCE_BY_BANK
                                }
                            />
                            <Form.Check
                                inline={true}
                                name={'IS_INSURANCE_BY_BANK'}
                                value="false"
                                checked={!values.IS_INSURANCE_BY_BANK}
                                label="Ոչ"
                                type="radio"
                                onChange={() => setFieldValue('IS_INSURANCE_BY_BANK', false)}
                                isInvalid={
                                    touched.IS_INSURANCE_BY_BANK && !!errors.IS_INSURANCE_BY_BANK
                                }
                            />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <Form.Label htmlFor="Pledge">Վարկ/Գրավ</Form.Label>
                        </td>
                        <td colSpan={2}>
                            <Form.Group controlId="Pledge" as={Row}>
                                <Form.Control
                                    className="control-150"
                                    type="text"
                                    value={`${pledgePercent}%`}
                                    readOnly={true}
                                    disabled={true}
                                />
                            </Form.Group>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <Form.Label htmlFor="APPRAISAL_COMPANY_CODE">
                                Գնահատող ընկերություններ
                            </Form.Label>
                        </td>
                        <td colSpan={2}>
                            <Form.Group controlId="APPRAISAL_COMPANY_CODE" as={Row}>
                                <Form.Control
                                    as="select"
                                    className="control-150"
                                    name="APPRAISAL_COMPANY_CODE"
                                    value={values.APPRAISAL_COMPANY_CODE || ''}
                                    onChange={handleChange}
                                    isValid={
                                        touched.APPRAISAL_COMPANY_CODE &&
                                        !errors.APPRAISAL_COMPANY_CODE
                                    }
                                    isInvalid={
                                        touched.APPRAISAL_COMPANY_CODE &&
                                        !!errors.APPRAISAL_COMPANY_CODE
                                    }
                                >
                                    <option value="">Ընտրել</option>
                                    {appraisalCompanies.data.map(company => (
                                        <option key={company.CODE} value={company.CODE}>
                                            {company.NAME}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors.APPRAISAL_COMPANY_CODE}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <Form.Label htmlFor="APPRAISAL_DATE">Գնահատման ամսաթիվ</Form.Label>
                        </td>
                        <td colSpan={2}>
                            <Form.Group controlId="APPRAISAL_DATE" as={Row}>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={
                                        values.APPRAISAL_DATE
                                            ? new Date(values.APPRAISAL_DATE)
                                            : null
                                    }
                                    onChange={(date, e) => {
                                        if (date) {
                                            setFieldValue('APPRAISAL_DATE', moment(date).format());
                                        }
                                    }}
                                    inline={false}
                                    name="APPRAISAL_DATE"
                                    customInput={
                                        <Form.Control
                                            isValid={
                                                touched.APPRAISAL_DATE && !errors.APPRAISAL_DATE
                                            }
                                            isInvalid={
                                                touched.APPRAISAL_DATE && !!errors.APPRAISAL_DATE
                                            }
                                        />
                                    }
                                ></DatePicker>
                                {touched.APPRAISAL_DATE && errors.APPRAISAL_DATE && (
                                    <p className="text-danger w-100">{errors.APPRAISAL_DATE}</p>
                                )}
                            </Form.Group>
                        </td>
                    </tr>
                </tbody>
                {values.IS_REAL_ESTATE !== null && (
                    <>
                        {values.IS_REAL_ESTATE ? (
                            <tbody>
                                <tr>
                                    <td>
                                        <Form.Label htmlFor="ESTATE_ADDRESS">
                                            Գրավի հասցե
                                        </Form.Label>
                                    </td>
                                    <td colSpan={2}>
                                        <Form.Group controlId="ESTATE_ADDRESS" as={Row}>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    name="ESTATE_ADDRESS"
                                                    placeholder="ք. Երևան, Կոմիտասի պող., շենք 15 (տասնհինգ), բն. 5 (հինգ)"
                                                    value={values.ESTATE_ADDRESS || ''}
                                                    onChange={Utils.formatInputValue(handleChange, {
                                                        pattern: /^[ա-ֆԱ-Ֆև0-9.․_# -=!@#$%^&,*()+|}{:;'/?]*$/
                                                    })}
                                                    isValid={
                                                        touched.ESTATE_ADDRESS &&
                                                        !errors.ESTATE_ADDRESS
                                                    }
                                                    isInvalid={
                                                        touched.ESTATE_ADDRESS &&
                                                        !!errors.ESTATE_ADDRESS
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.ESTATE_ADDRESS}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <Form.Label htmlFor="ESTATE_RESIDENTIAL_AREA">
                                            Գրավի առարկայի մակերես
                                        </Form.Label>
                                    </td>
                                    <td colSpan={2}>
                                        <Form.Row>
                                            <Form.Group
                                                as={Col}
                                                sm={5}
                                                controlId={'ESTATE_RESIDENTIAL_AREA'}
                                            >
                                                <Form.Control
                                                    name="ESTATE_RESIDENTIAL_AREA"
                                                    type="number"
                                                    value={String(values.ESTATE_RESIDENTIAL_AREA)}
                                                    onChange={handleChange}
                                                    placeholder="Բնակելի տարածք"
                                                    isValid={
                                                        touched.ESTATE_RESIDENTIAL_AREA &&
                                                        !errors.ESTATE_RESIDENTIAL_AREA
                                                    }
                                                    isInvalid={
                                                        touched.ESTATE_RESIDENTIAL_AREA &&
                                                        !!errors.ESTATE_RESIDENTIAL_AREA
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.ESTATE_RESIDENTIAL_AREA}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group
                                                as={Col}
                                                sm={3}
                                                controlId={'ESTATE_LAND_AREA'}
                                            >
                                                <Form.Control
                                                    name="ESTATE_LAND_AREA"
                                                    type="number"
                                                    value={String(values.ESTATE_LAND_AREA)}
                                                    onChange={handleChange}
                                                    placeholder="Հողատարածք"
                                                    isValid={
                                                        touched.ESTATE_LAND_AREA &&
                                                        !errors.ESTATE_LAND_AREA
                                                    }
                                                    isInvalid={
                                                        touched.ESTATE_LAND_AREA &&
                                                        !!errors.ESTATE_LAND_AREA
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.ESTATE_LAND_AREA}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <Form.Label htmlFor="OWNERSHIP_CERTIFICATE_NUMBER">
                                            Սեփականության վկայագիր
                                        </Form.Label>
                                    </td>
                                    <td colSpan={2}>
                                        <Form.Row>
                                            <Form.Group
                                                as={Col}
                                                sm={5}
                                                controlId="OWNERSHIP_CERTIFICATE_NUMBER"
                                            >
                                                <Form.Control
                                                    name="OWNERSHIP_CERTIFICATE_NUMBER"
                                                    type="text"
                                                    value={String(
                                                        values.OWNERSHIP_CERTIFICATE_NUMBER || ''
                                                    )}
                                                    onChange={handleChange}
                                                    placeholder="Համար"
                                                    isValid={
                                                        touched.OWNERSHIP_CERTIFICATE_NUMBER &&
                                                        !errors.OWNERSHIP_CERTIFICATE_NUMBER
                                                    }
                                                    isInvalid={
                                                        touched.OWNERSHIP_CERTIFICATE_NUMBER &&
                                                        !!errors.OWNERSHIP_CERTIFICATE_NUMBER
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.OWNERSHIP_CERTIFICATE_NUMBER}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group
                                                controlId="OWNERSHIP_CERTIFICATE_DATE"
                                                as={Col}
                                                sm={3}
                                            >
                                                <DatePicker
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Ամսաթիվ"
                                                    autoComplete="false"
                                                    selected={
                                                        values.OWNERSHIP_CERTIFICATE_DATE
                                                            ? new Date(
                                                                  values.OWNERSHIP_CERTIFICATE_DATE
                                                              )
                                                            : null
                                                    }
                                                    onChange={(date, e) => {
                                                        if (date) {
                                                            setFieldValue(
                                                                'OWNERSHIP_CERTIFICATE_DATE',
                                                                moment(date).format()
                                                            );
                                                        }
                                                    }}
                                                    inline={false}
                                                    name="OWNERSHIP_CERTIFICATE_DATE"
                                                    customInput={
                                                        <Form.Control
                                                            isValid={
                                                                touched.OWNERSHIP_CERTIFICATE_DATE &&
                                                                !errors.OWNERSHIP_CERTIFICATE_DATE
                                                            }
                                                            isInvalid={
                                                                touched.OWNERSHIP_CERTIFICATE_DATE &&
                                                                !!errors.OWNERSHIP_CERTIFICATE_DATE
                                                            }
                                                        />
                                                    }
                                                ></DatePicker>
                                                {touched.OWNERSHIP_CERTIFICATE_DATE &&
                                                    errors.OWNERSHIP_CERTIFICATE_DATE && (
                                                        <p className="text-danger w-100">
                                                            {errors.OWNERSHIP_CERTIFICATE_DATE}
                                                        </p>
                                                    )}
                                            </Form.Group>
                                        </Form.Row>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td>
                                        <Form.Label htmlFor="VEHICLE_MODEL">Մակնիշ</Form.Label>
                                    </td>
                                    <td colSpan={2}>
                                        <Form.Group controlId="VEHICLE_MODEL" as={Row}>
                                            <Form.Control
                                                className="control-250"
                                                name="VEHICLE_MODEL"
                                                value={values.VEHICLE_MODEL}
                                                onChange={handleChange}
                                                isValid={
                                                    touched.VEHICLE_MODEL && !errors.VEHICLE_MODEL
                                                }
                                                isInvalid={
                                                    touched.VEHICLE_MODEL && !!errors.VEHICLE_MODEL
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.VEHICLE_MODEL}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form.Label htmlFor="VEHICLE_VIN">
                                            Նույնականացման համար
                                        </Form.Label>
                                    </td>
                                    <td colSpan={2}>
                                        <Form.Group controlId="VEHICLE_VIN" as={Row}>
                                            <Form.Control
                                                className="control-250"
                                                name="VEHICLE_VIN"
                                                value={values.VEHICLE_VIN}
                                                onChange={handleChange}
                                                placeholder="օրինակ։ HB1298"
                                                isValid={touched.VEHICLE_VIN && !errors.VEHICLE_VIN}
                                                isInvalid={
                                                    touched.VEHICLE_VIN && !!errors.VEHICLE_VIN
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.VEHICLE_VIN}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form.Label htmlFor="OWNERSHIP_CERTIFICATE_NUMBER">
                                            Սեփականության վկայագիր
                                        </Form.Label>
                                    </td>
                                    <td colSpan={2}>
                                        <Form.Row>
                                            <Form.Group
                                                as={Col}
                                                sm={5}
                                                controlId="OWNERSHIP_CERTIFICATE_NUMBER"
                                            >
                                                <Form.Control
                                                    name="OWNERSHIP_CERTIFICATE_NUMBER"
                                                    type="number"
                                                    value={String(
                                                        values.OWNERSHIP_CERTIFICATE_NUMBER
                                                    )}
                                                    onChange={handleChange}
                                                    placeholder="Համար"
                                                    isValid={
                                                        touched.OWNERSHIP_CERTIFICATE_NUMBER &&
                                                        !errors.OWNERSHIP_CERTIFICATE_NUMBER
                                                    }
                                                    isInvalid={
                                                        touched.OWNERSHIP_CERTIFICATE_NUMBER &&
                                                        !!errors.OWNERSHIP_CERTIFICATE_NUMBER
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.OWNERSHIP_CERTIFICATE_NUMBER}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group
                                                controlId="OWNERSHIP_CERTIFICATE_DATE"
                                                as={Col}
                                                sm={3}
                                            >
                                                <DatePicker
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Ամսաթիվ"
                                                    selected={
                                                        values.OWNERSHIP_CERTIFICATE_DATE
                                                            ? new Date(
                                                                  values.OWNERSHIP_CERTIFICATE_DATE
                                                              )
                                                            : null
                                                    }
                                                    onChange={(date, e) => {
                                                        if (date) {
                                                            setFieldValue(
                                                                'OWNERSHIP_CERTIFICATE_DATE',
                                                                moment(date).format()
                                                            );
                                                        }
                                                    }}
                                                    inline={false}
                                                    name="OWNERSHIP_CERTIFICATE_DATE"
                                                    customInput={
                                                        <Form.Control
                                                            isValid={
                                                                touched.OWNERSHIP_CERTIFICATE_DATE &&
                                                                !errors.OWNERSHIP_CERTIFICATE_DATE
                                                            }
                                                            isInvalid={
                                                                touched.OWNERSHIP_CERTIFICATE_DATE &&
                                                                !!errors.OWNERSHIP_CERTIFICATE_DATE
                                                            }
                                                        />
                                                    }
                                                ></DatePicker>
                                                {touched.OWNERSHIP_CERTIFICATE_DATE &&
                                                    errors.OWNERSHIP_CERTIFICATE_DATE && (
                                                        <p className="text-danger w-100">
                                                            {errors.OWNERSHIP_CERTIFICATE_DATE}
                                                        </p>
                                                    )}
                                            </Form.Group>
                                        </Form.Row>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <Form.Label htmlFor="VEHICLE_DATE">
                                            Արտադրության տարեթիվ
                                        </Form.Label>
                                    </td>
                                    <td colSpan={2}>
                                        <Form.Group controlId="VEHICLE_DATE" as={Row}>
                                            <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                selected={
                                                    values.VEHICLE_DATE
                                                        ? new Date(values.VEHICLE_DATE)
                                                        : null
                                                }
                                                onChange={(date, e) => {
                                                    date &&
                                                        setFieldValue(
                                                            'VEHICLE_DATE',
                                                            moment(date).format()
                                                        );
                                                }}
                                                inline={false}
                                                name="VEHICLE_DATE"
                                                customInput={
                                                    <Form.Control
                                                        isValid={
                                                            touched.VEHICLE_DATE &&
                                                            !errors.VEHICLE_DATE
                                                        }
                                                        isInvalid={
                                                            touched.VEHICLE_DATE &&
                                                            !!errors.VEHICLE_DATE
                                                        }
                                                    />
                                                }
                                            ></DatePicker>
                                            {touched.VEHICLE_DATE && errors.VEHICLE_DATE && (
                                                <p className="text-danger w-100">
                                                    {errors.VEHICLE_DATE}
                                                </p>
                                            )}
                                        </Form.Group>
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </>
                )}
            </Table>

            <div className="photo-upload-section">
                <h4>Գրավի սեփականության վկայական</h4>
                <DocumentUploader
                    id={id}
                    documentType={'C01'}
                    hasDoc={Utils.checkDocumentIsUploaded('C01', documents)}
                    setFieldValue={setFieldValue}
                />
                {errors.C01 && <p className="text-danger w-100">{errors.C01}</p>}
            </div>

            <div className="photo-upload-section">
                <h4>Գնահատման հաշվետվություն</h4>
                <DocumentUploader
                    id={id}
                    documentType={'A01'}
                    hasDoc={Utils.checkDocumentIsUploaded('A01', documents)}
                    setFieldValue={setFieldValue}
                />
                {errors.A01 && <p className="text-danger w-100">{errors.A01}</p>}
            </div>
        </div>
    );
};

export default Pledge;
