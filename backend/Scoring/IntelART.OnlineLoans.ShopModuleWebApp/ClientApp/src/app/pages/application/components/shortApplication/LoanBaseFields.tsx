import { Col, Form, Row } from 'react-bootstrap';

import { FormikProps } from 'formik';
import { IApplicationData } from 'app/store/reducers/application/models';
import { IStoreIndustires } from 'app/store/reducers/directory/factualIndustries/initialState';
import InputMask from 'react-input-mask';
import NumberFormat from 'react-number-format';
import React from 'react';
import { Utils } from 'app/services/utils';
import clsx from 'clsx';

export interface ILoanBaseFieldsProps extends FormikProps<IApplicationData> {
    title?: string;
    disableAll?: boolean;
    industries: IStoreIndustires;
}

const LoanBaseFields: React.FC<ILoanBaseFieldsProps> = React.memo(props => {
    const { values, errors, touched, handleChange, disableAll, industries } = props;

    return (
        <fieldset className="loan-form-group" disabled={disableAll}>
            <Form.Group controlId="TAX_ID_NUMBER" as={Row}>
                <Form.Label column={true} sm={5}>
                    Հարկ վճարողների հաշվառման համար(ՀՎՀՀ)
                </Form.Label>
                <Col sm={7}>
                    <Form.Control
                        type="text"
                        name="TAX_ID_NUMBER"
                        value={values.TAX_ID_NUMBER}
                        isValid={touched.TAX_ID_NUMBER && !errors.TAX_ID_NUMBER}
                        isInvalid={touched.TAX_ID_NUMBER && !!errors.TAX_ID_NUMBER}
                        maxLength={8}
                        onChange={Utils.formatInputValue(handleChange, {
                            pattern: /^(0|[0-9][0-9]*)$/
                        })}
                        disabled={!!values.TAX_ID_NUMBER}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.TAX_ID_NUMBER}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group controlId="COMPANY_NAME" as={Row}>
                <Form.Label column={true} sm={5}>
                    Իրավաբանական անձի / ԱՁ-ի անվանում (անգլերեն)
                </Form.Label>
                <Col sm={7}>
                    <Form.Control
                        type="text"
                        name="COMPANY_NAME"
                        value={values.COMPANY_NAME}
                        isValid={touched.COMPANY_NAME && !errors.COMPANY_NAME}
                        isInvalid={touched.COMPANY_NAME && !!errors.COMPANY_NAME}
                        onChange={Utils.formatInputValue(handleChange, {
                            pattern: /^[a-zA-Z0-9._# -=!@#$%^&*()+|}{:;'/?]*$/
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.COMPANY_NAME}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group controlId="FACTUAL_INDUSTRY_CODE" as={Row}>
                <Form.Label column={true} sm={5}>
                    Ոլորտ
                </Form.Label>
                <Col sm={7}>
                    <Form.Control
                        as="select"
                        name="FACTUAL_INDUSTRY_CODE"
                        value={values.FACTUAL_INDUSTRY_CODE}
                        isValid={touched.FACTUAL_INDUSTRY_CODE && !errors.FACTUAL_INDUSTRY_CODE}
                        isInvalid={touched.FACTUAL_INDUSTRY_CODE && !!errors.FACTUAL_INDUSTRY_CODE}
                        onChange={handleChange}
                    >
                        <option value="" disabled={true}>
                            Ընտրել
                        </option>
                        {industries.data.map(industri => (
                            <option value={industri.CODE} key={industri.CODE}>
                                {industri.NAME}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.FACTUAL_INDUSTRY_CODE}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group controlId="ANNUAL_TURNOVER" as={Row}>
                <Form.Label column={true} sm={5}>
                    Տարեկան շրջանառություն
                </Form.Label>
                <Col sm={7}>
                    <NumberFormat
                        thousandSeparator={true}
                        onChange={Utils.formatInputValue(handleChange, {
                            replace: /[(\,)\s]/g
                        })}
                        name="ANNUAL_TURNOVER"
                        value={values.ANNUAL_TURNOVER || ''}
                        customInput={Form.Control}
                        className={clsx({
                            'is-valid': touched.ANNUAL_TURNOVER && !errors.ANNUAL_TURNOVER,
                            'is-invalid': touched.ANNUAL_TURNOVER && !!errors.ANNUAL_TURNOVER
                        })}
                    />

                    <Form.Control.Feedback type="invalid">
                        {errors.ANNUAL_TURNOVER}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group controlId="MOBILE_PHONE" as={Row}>
                <Form.Label column={true} sm={5}>
                    Հեռախոս
                </Form.Label>
                <Col sm={7}>
                    <InputMask
                        mask="+37\4 99 99 99 99"
                        maskChar="_"
                        value={values.MOBILE_PHONE}
                        onChange={handleChange}
                    >
                        {(inputProps: any) => {
                            return (
                                <Form.Control
                                    {...inputProps}
                                    type="tel"
                                    name="MOBILE_PHONE"
                                    isValid={touched.MOBILE_PHONE && !errors.MOBILE_PHONE}
                                    isInvalid={touched.MOBILE_PHONE && !!errors.MOBILE_PHONE}
                                />
                            );
                        }}
                    </InputMask>
                    <Form.Control.Feedback type="invalid">
                        {errors.MOBILE_PHONE}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group controlId="COMPANY_EMAIL" as={Row}>
                <Form.Label column={true} sm={5}>
                    Էլ.փոստ
                </Form.Label>
                <Col sm={7}>
                    <Form.Control
                        type="COMPANY_EMAIL"
                        name="COMPANY_EMAIL"
                        value={values.COMPANY_EMAIL}
                        isValid={touched.COMPANY_EMAIL && !errors.COMPANY_EMAIL}
                        isInvalid={touched.COMPANY_EMAIL && !!errors.COMPANY_EMAIL}
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.COMPANY_EMAIL}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group controlId="WEBSITE" as={Row}>
                <Form.Label column={true} sm={5}>
                    Web կայքի հասցե
                </Form.Label>
                <Col sm={7}>
                    <Form.Control
                        type="text"
                        name="WEBSITE"
                        placeholder={'www.example.am'}
                        value={values.WEBSITE}
                        isInvalid={touched.WEBSITE && !!errors.WEBSITE}
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">{errors.WEBSITE}</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group controlId="FACEBOOK" as={Row}>
                <Form.Label column={true} sm={5}>
                    Ֆեյսբուքյան էջի անվանում
                </Form.Label>
                <Col sm={7}>
                    <Form.Control
                        type="text"
                        name="FACEBOOK"
                        placeholder={'https://m.facebook.com/PageName/'}
                        value={values.FACEBOOK}
                        isInvalid={touched.FACEBOOK && !!errors.FACEBOOK}
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">{errors.WEBSITE}</Form.Control.Feedback>
                </Col>
            </Form.Group>
        </fieldset>
    );
});

export default LoanBaseFields;
