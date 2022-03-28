import * as yup from 'yup'

import { Button, Col, Form, Row } from 'react-bootstrap'

import { Formik } from 'formik'
import React from 'react'
import { Utils } from 'app/services/utils'

export interface ISearchFormProps {
  onValidSubmit: any;
  taxIdNumber: string;
}

const validationSchema = yup.object({
  taxIdNumber: yup
    .string()
    .test(
      'length',
      Utils.localizedClientErrors('TAXID_NUMBER'),
      val => val && val.length === 8
    ),
})

const SearchForm: React.FC<ISearchFormProps> = (props: ISearchFormProps) => {
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ taxIdNumber: props.taxIdNumber }}
      onSubmit={props.onValidSubmit}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => {
        return (
          <Form noValidate={true} onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="taxIdNumber">
              <Col xl="11" lg="11" md="10" xs="10">
                <Form.Control
                  type="text"
                  defaultValue={props.taxIdNumber}
                  maxLength={8}
                  name="taxIdNumber"
                  placeholder="Փնտրել ՀՎՀՀ"
                  className="rounded-1"
                  onChange={Utils.formatInputValue(handleChange, {
                    pattern: /^(0|[0-9][0-9]*)$/,
                  })}
                  isValid={touched.taxIdNumber && !errors.taxIdNumber}
                  isInvalid={touched.taxIdNumber && !!errors.taxIdNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.taxIdNumber}
                </Form.Control.Feedback>
              </Col>
              <Col xl="1" lg="1" md="2" xs="2">
                <Button variant="outline-primary" type="submit">
                  Փնտրել
                </Button>
              </Col>
            </Form.Group>
          </Form>
        )
      }}
    </Formik>
  )
}

export default SearchForm
