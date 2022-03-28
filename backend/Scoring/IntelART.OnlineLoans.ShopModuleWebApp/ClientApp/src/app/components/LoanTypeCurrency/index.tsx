import { Col, Form, Row, Spinner } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { getCurrencies, getLoanTypes } from '@app/api/Directory';
import { useDispatch, useSelector } from 'react-redux';

import { ReducerState } from 'AppTypes';

interface ILoanTypeCurrencyProps {
  loanName: string;
  loanValue: string
  loanTouched: boolean | undefined;
  loanError: string | undefined;
  currencyName: string;
  currencyValue: string;
  currencyTouched: boolean | undefined;
  currencyError: string | undefined;
  handleChange: (e: any) => void;
  apiEndpoint: string
}

const LoanTypeCurrency: React.FC<ILoanTypeCurrencyProps> = props => {
  const {
    loanName,
    loanValue,
    currencyName,
    currencyValue,
    currencyTouched,
    currencyError,
    loanTouched,
    loanError,
    handleChange,
    apiEndpoint = "LoanTypes"
    } = props

    const dispatch = useDispatch()
    const directory = useSelector((store: ReducerState) => store.directory)
    const {loanTypes, currencies} = directory

    useEffect(() => {
      dispatch(getLoanTypes(apiEndpoint))
    }, [apiEndpoint])

    useEffect(() => {
      const currency = currencies.data[loanValue]
      if (currency && currency.length === 1) {
        handleChange({target: {name: `${currencyName}`, value: currencies.data[loanValue][0].CODE}})
      }
    }, [currencies.data[loanValue]])

    useEffect(() => {
      if (!currencies.data[loanValue] && !!loanValue) {
        dispatch(getCurrencies(loanValue))
      }
    }, [loanValue])

  return (
    <>
      <Form.Group controlId={loanName} as={Row}>
        <Form.Label column={true} sm={5}>
          Վարկատեսակ
        </Form.Label>
        <Col sm={7}>
          <Form.Control
            as="select"
            name={loanName}
            value={String(loanValue)}
            isValid={loanTouched && !loanError}
            isInvalid={loanTouched && !!loanError}
            onChange={handleChange}
          >
            <option value="">Ընտրել</option>
            {loanTypes.data.map(type => (
              <option key={type.CODE} value={type.CODE}>
                {type.NAME}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {loanError}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group controlId={currencyName} as={Row}>
        <Form.Label column={true} sm={5}>
          Վարկի արժույթ
        </Form.Label>
        <Col sm={7}>
          {currencies.currenciesIsLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mr-1"
              variant="primary"
            />
          ) : ( !loanValue ? 'Ընտրեք վարկատեսակը' :
          currencies.data[loanValue] &&
          currencies.data[loanValue].map(currency => (
            <Form.Check
              required={true}
              key={currency.CODE}
              inline={true}
              type="radio"
              label={currency.NAME}
              name={currencyName}
              id={`currency${currency.CODE}`}
              checked={currencyValue === currency.CODE}
              value={currency.CODE}
              className="loan-form-checkbox"
              isInvalid={currencyTouched && !!currencyError}
              onChange={handleChange}
            />
          ))
          )}
        </Col>
      </Form.Group>
    </>
  )
}

export default LoanTypeCurrency
