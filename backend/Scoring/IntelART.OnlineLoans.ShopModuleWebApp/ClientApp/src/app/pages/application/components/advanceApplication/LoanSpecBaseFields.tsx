import { Col, Form, Row } from 'react-bootstrap'
import NumberFormat, {NumberFormatValues} from 'react-number-format'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FormikProps } from 'formik'
import { ILoanSpecApplicationData } from '@app/store/reducers/loanSpecApplication/models'
import LoanTypeCurrency from '@app/components/LoanTypeCurrency'
import { ReducerState } from 'AppTypes'
import { Utils } from '@app/services/utils'
import clsx from 'clsx'
import { getBusinessStateTypes } from '@app/api/Directory'
import { getLoanLimits } from '@app/api/LoanLimits'
import { getLoanParameters } from '@app/api/Parameters/loanParameters'
import moment from 'moment'

interface ILoanSpecBaseProps extends FormikProps<ILoanSpecApplicationData> {
  id: string
  setPledgeIsShow: (needShow: boolean) => void;
}

const LoanSpecBase: React.FC<ILoanSpecBaseProps> = props => {
  const dispatch = useDispatch()
  const businessStateTypes = useSelector(
    (store: ReducerState) => store.directory.businessStateTypes
  )
  const loanSettings = useSelector((store: ReducerState) => store.loanSettings)
  const loanLimits = useSelector((store: ReducerState) => store.loanLimits.data)
  const { values, errors, touched, handleChange, setPledgeIsShow, id, setFieldValue } = props
  const { lsLoanTerms, unsecuredLimits } = loanSettings

  useEffect(() => {
    !businessStateTypes.businessStateTypesLoaded &&
      dispatch(getBusinessStateTypes(id))
  }, [businessStateTypes.businessStateTypesLoaded])

  useEffect(() => {
    const { LS_LOAN_TYPE_ID } = values
    !!LS_LOAN_TYPE_ID && dispatch(getLoanParameters(LS_LOAN_TYPE_ID))
  }, [values.LS_LOAN_TYPE_ID])

  useEffect(() => {
    const { LS_LOAN_AMOUNT, LS_CURRENCY_CODE } = values
    const maxAmount = unsecuredLimits.find(l => l.CURRENCY === LS_CURRENCY_CODE)
    maxAmount && setPledgeIsShow(LS_LOAN_AMOUNT > maxAmount.AMOUNT)
  }, [values.LS_LOAN_AMOUNT, values.LS_CURRENCY_CODE, unsecuredLimits])

  useEffect(() => {
    if (!!values.LS_LOAN_TYPE_ID && !!values.LS_CURRENCY_CODE) {
        dispatch(getLoanLimits(values.LS_LOAN_TYPE_ID, values.LS_CURRENCY_CODE))
      }
  }, [values.LS_LOAN_TYPE_ID, values.LS_CURRENCY_CODE])

  return (
    <Row>
      <Col className="mr-3">
        <fieldset className="loan-form-group">
          <Form.Group controlId="TAX_ID_NUMBER" as={Row} className="p-0">
            <Form.Label
              column={true}
              sm={5}
              className="equal-to-company-height"
            >
              ՀՎՀՀ
            </Form.Label>
            <Col sm={7}>
              <Form.Control
                className="font-weight-bold"
                plaintext={true}
                readOnly={true}
                type="text"
                name="TAX_ID_NUMBER"
                defaultValue={values.TAX_ID_NUMBER}
                maxLength={8}
              />
            </Col>
          </Form.Group>
          <hr className="mt-1" />

          <LoanTypeCurrency
            loanName={'LS_LOAN_TYPE_ID'}
            loanValue={values.LS_LOAN_TYPE_ID}
            loanTouched={touched.LS_LOAN_TYPE_ID}
            loanError={errors.LS_LOAN_TYPE_ID}
            currencyName={'LS_CURRENCY_CODE'}
            currencyValue={values.LS_CURRENCY_CODE}
            currencyTouched={touched.LS_CURRENCY_CODE}
            currencyError={errors.LS_CURRENCY_CODE}
            handleChange={handleChange}
            apiEndpoint={`LSLoanTypes`}
          />

          <Form.Group controlId="LS_LOAN_AMOUNT" as={Row}>
            <Form.Label column={true} sm={5}>
              Հայցվող Վարկի գումար
            </Form.Label>
            <Col sm={7}>
              <NumberFormat
                thousandSeparator={true}
                name="LS_LOAN_AMOUNT"
                value={values.LS_LOAN_AMOUNT}
                customInput={Form.Control}
                onChange={Utils.formatInputValue(handleChange, {
                  replace: /[(\,)\s]/g,
                })}
                isAllowed={val => {
                  const newVal = Number(val.value);
                  return newVal - Number(values.LS_LOAN_AMOUNT) <= 0 || newVal <= loanLimits.TO_AMOUNT
                }}
                className={clsx({
                  'is-valid': touched.LS_LOAN_AMOUNT && !errors.LS_LOAN_AMOUNT,
                  'is-invalid':
                    touched.LS_LOAN_AMOUNT && !!errors.LS_LOAN_AMOUNT,
                })}
                placeholder={
                  `${Utils.formatAsCurrency(
                    loanLimits.FROM_AMOUNT
                  )} - ${Utils.formatAsCurrency(loanLimits.TO_AMOUNT)}`
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.LS_LOAN_AMOUNT}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group controlId="APPROVED_AMOUNT" as={Row}>
            <Form.Label column={true} sm={5}>
              Հաստատված վարկի գումար
            </Form.Label>
            <Col sm={7}>
              <Form.Control
                type="text"
                defaultValue={values.APPROVED_AMOUNT}
                plaintext={true}
                readOnly={true}
              />
            </Col>
          </Form.Group>

          <Form.Group controlId="LS_LOAN_TERM" as={Row}>
            <Form.Label column={true} sm={5}>
              Վարկի Ժամկետ
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                as="select"
                name="LS_LOAN_TERM"
                value={values.LS_LOAN_TERM || ''}
                onChange={handleChange}
                isValid={touched.LS_LOAN_TERM && !errors.LS_LOAN_TERM}
                isInvalid={touched.LS_LOAN_TERM && !!errors.LS_LOAN_TERM}
              >
                <option value="">Ընտրել</option>
                {lsLoanTerms.map(term => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.LS_LOAN_TERM}
              </Form.Control.Feedback>
            </Col>
            <Col sm={3}>
              <p className="form-label col-form-label">Ամիս</p>
            </Col>
          </Form.Group>

          <Form.Group controlId="LS_REPAYMENT_DAY" as={Row}>
            <Form.Label column={true} sm={5}>
              Վարկի մարման նախընտրելի օր
            </Form.Label>
            <Col sm={7}>
              <Form.Control
                type="number"
                name="LS_REPAYMENT_DAY"
                value={String(values.LS_REPAYMENT_DAY)}
                onChange={handleChange}
                isValid={touched.LS_REPAYMENT_DAY && !errors.LS_REPAYMENT_DAY}
                isInvalid={
                  touched.LS_REPAYMENT_DAY && !!errors.LS_REPAYMENT_DAY
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.LS_REPAYMENT_DAY}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
        </fieldset>
      </Col>
      <Col className="ml-3">
        <fieldset className="loan-form-group">
          <Form.Group controlId="COMPANY_NAME" as={Row} className="p-0">
            <Form.Label column={true} sm={5}>
              Իրավաբանական անձի / ԱՁ-ի անվանում
            </Form.Label>
            <Col sm={7}>
              <Form.Control
                className="font-weight-bold"
                type="text"
                name="COMPANY_NAME"
                plaintext={true}
                readOnly={true}
                defaultValue={values.COMPANY_NAME}
              />
            </Col>
          </Form.Group>
          <hr className="mt-1" />
          <Form.Group controlId="BUSINESS_SPACE" as={Row}>
            <Form.Label column={true} sm={5}>
              Բիզնես տարածքի մակերես
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                type="number"
                value={String(values.BUSINESS_SPACE)}
                onChange={handleChange}
                isValid={touched.BUSINESS_SPACE && !errors.BUSINESS_SPACE}
                isInvalid={touched.BUSINESS_SPACE && !!errors.BUSINESS_SPACE}
              />
              <Form.Control.Feedback type="invalid">
                {errors.BUSINESS_SPACE}
              </Form.Control.Feedback>
            </Col>
            <Col sm={2}>
              <p className="form-label col-form-label">ք.մ</p>
            </Col>
          </Form.Group>
          <Form.Group controlId="EMPLOYEE_COUNT" as={Row}>
            <Form.Label column={true} sm={5}>
              Աշխատակիցների քանակ
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                type="number"
                value={String(values.EMPLOYEE_COUNT)}
                onChange={handleChange}
                isValid={touched.EMPLOYEE_COUNT && !errors.EMPLOYEE_COUNT}
                isInvalid={touched.EMPLOYEE_COUNT && !!errors.EMPLOYEE_COUNT}
              />
              <Form.Control.Feedback type="invalid">
                {errors.EMPLOYEE_COUNT}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group controlId="FAMILY_MEMBER_COUNT" as={Row}>
            <Form.Label column={true} sm={5}>
              Ընտանիքի անդամների քանակ
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                type="number"
                value={String(values.FAMILY_MEMBER_COUNT)}
                onChange={handleChange}
                isValid={
                  touched.FAMILY_MEMBER_COUNT && !errors.FAMILY_MEMBER_COUNT
                }
                isInvalid={
                  touched.FAMILY_MEMBER_COUNT && !!errors.FAMILY_MEMBER_COUNT
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.FAMILY_MEMBER_COUNT}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group controlId="VEHICLE_COUNT" as={Row}>
            <Form.Label column={true} sm={5}>
              Տրանսպորտային միջոցի քանակ
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                type="number"
                value={String(values.VEHICLE_COUNT)}
                onChange={handleChange}
                isValid={touched.VEHICLE_COUNT && !errors.VEHICLE_COUNT}
                isInvalid={touched.VEHICLE_COUNT && !!errors.VEHICLE_COUNT}
              />
              <Form.Control.Feedback type="invalid">
                {errors.VEHICLE_COUNT}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group controlId="BUSINESS_STATE_CODE" as={Row}>
            <Form.Label column={true} sm={5}>
              Բիզնես գործունեության վայր
            </Form.Label>
            <Col sm={7}>
              <Form.Control
                as="select"
                name="BUSINESS_STATE_CODE"
                value={String(values.BUSINESS_STATE_CODE) || ''}
                onChange={handleChange}
                isValid={
                  touched.BUSINESS_STATE_CODE && !errors.BUSINESS_STATE_CODE
                }
                isInvalid={
                  touched.BUSINESS_STATE_CODE && !!errors.BUSINESS_STATE_CODE
                }
              >
                <option value="">Ընտրել</option>
                {businessStateTypes.data.map(type => (
                  <option key={type.CODE} value={type.CODE}>
                    {type.NAME}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.BUSINESS_STATE_CODE}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group controlId="LS_ENTRY_DATE" as={Row}>
            <Form.Label column={true} sm={5}>
              Վերլուծման ամսաթիվ
            </Form.Label>
            <Col sm={7}>
              <Form.Control
                type="text"
                value={moment(values.LS_ENTRY_DATE).format('DD/MM/YYYY')}
                readOnly={true}
                plaintext={true}
              />
            </Col>
          </Form.Group>
        </fieldset>
      </Col>
    </Row>
  )
}

export default LoanSpecBase
