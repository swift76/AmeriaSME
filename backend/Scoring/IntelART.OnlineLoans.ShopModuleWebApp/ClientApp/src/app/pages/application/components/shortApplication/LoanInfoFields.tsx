import { Col, Form, Row } from 'react-bootstrap'

import { FormikProps } from 'formik'
import { IApplicationData } from '@store/reducers/application/models'
import LoanTypeCurrency from '@components/LoanTypeCurrency'
import NumberFormat from 'react-number-format'
import React from 'react'
import { Utils } from '@app/services/utils'
import clsx from 'clsx'

export interface ILoanInfoFieldsProps extends FormikProps<IApplicationData> {
  title?: string;
}

const LoanInfoFields: React.FC<ILoanInfoFieldsProps> = React.memo(props => {
  const { values, touched, errors, handleChange } = props

  return (
    <fieldset className="loan-form-group">
      <legend>{props.title}</legend>

      <LoanTypeCurrency
        loanName={'LOAN_TYPE_ID'}
        loanValue={values.LOAN_TYPE_ID}
        loanTouched={touched.LOAN_TYPE_ID}
        loanError={errors.LOAN_TYPE_ID}
        currencyName={'CURRENCY_CODE'}
        currencyValue={values.CURRENCY_CODE}
        currencyTouched={touched.CURRENCY_CODE}
        currencyError={errors.CURRENCY_CODE}
        handleChange={handleChange}
        apiEndpoint={`LoanTypes`}
      />

      <Form.Group controlId="formAmount" as={Row}>
        <Form.Label column={true} sm={5}>
          Վարկի գումար
        </Form.Label>
        <Col sm={7}>
          <NumberFormat
            thousandSeparator={true}
            onChange={Utils.formatInputValue(handleChange, {
              replace: /[(\,)\s]/g,
            })}
            name="INITIAL_AMOUNT"
            value={values.INITIAL_AMOUNT || ''}
            customInput={Form.Control}
            className={clsx({
              'is-valid': touched.INITIAL_AMOUNT && !errors.INITIAL_AMOUNT,
              'is-invalid': touched.INITIAL_AMOUNT && !!errors.INITIAL_AMOUNT,
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.INITIAL_AMOUNT}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
    </fieldset>
  )
})

export default LoanInfoFields
