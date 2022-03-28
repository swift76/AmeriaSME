import * as yup from 'yup'

import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'

import { Formik } from 'formik'
import React from 'react'
import { Utils } from 'app/services/utils'

export interface IFormProps {
  onValidSubmit: any;
}

const validationSchema = yup.object({
  OldPassword: yup
    .string()
    .min(3, Utils.localizedClientErrors('PASSWORD_LENGTH'))
    .required(Utils.localizedClientErrors('PASSWORD_REQUIRED')),
  NewPassword: yup
    .string()
    .min(3, Utils.localizedClientErrors('PASSWORD_LENGTH'))
    .required(Utils.localizedClientErrors('PASSWORD_REQUIRED')),
  ConfirmNewPassword: yup
    .string()
    .required(Utils.localizedClientErrors('PASSWORD_REQUIRED'))
    .oneOf(
      [yup.ref('NewPassword'), ''],
      Utils.localizedClientErrors('PASSWORDS_MATCH')
    ),
})

const LoginForm: React.FC<IFormProps> = (props: IFormProps) => {
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        OldPassword: '',
        NewPassword: '',
        ConfirmNewPassword: '',
      }}
      onSubmit={props.onValidSubmit}
    >
      {({
        handleSubmit,
        handleReset,
        handleChange,
        values,
        touched,
        errors,
      }) => (
        <Form
          className="change-password-form"
          noValidate={true}
          onSubmit={handleSubmit}
        >
          <Form.Group as={Row} controlId="formPassword">
            <Form.Label column={true} sm="3">
              Ընթացիկ գաղտաբառ
            </Form.Label>
            <Col sm="4">
              <Form.Control
                type="password"
                name="OldPassword"
                value={values.OldPassword}
                onChange={handleChange}
                isValid={touched.OldPassword && !errors.OldPassword}
                isInvalid={touched.OldPassword && !!errors.OldPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.OldPassword}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPasswordNew">
            <Form.Label column={true} sm="3">
              Նոր գաղտաբառ
            </Form.Label>
            <Col sm="4">
              <Form.Control
                type="password"
                name="NewPassword"
                value={values.NewPassword}
                onChange={handleChange}
                isValid={touched.NewPassword && !errors.NewPassword}
                isInvalid={touched.NewPassword && !!errors.NewPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.NewPassword}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPasswordConfirm">
            <Form.Label column={true} sm="3">
              Կրկնել գաղտաբառը
            </Form.Label>
            <Col sm="4">
              <Form.Control
                type="password"
                name="ConfirmNewPassword"
                value={values.ConfirmNewPassword}
                onChange={handleChange}
                isValid={
                  touched.ConfirmNewPassword && !errors.ConfirmNewPassword
                }
                isInvalid={
                  touched.ConfirmNewPassword && !!errors.ConfirmNewPassword
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.ConfirmNewPassword}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <hr className="mt-4" />
          <div className="text-right">
            <Button
              variant="outline-primary"
              className="mr-2"
              onClick={handleReset}
            >
              Չեղարկել
            </Button>
            <Button variant="primary" type="submit">
              Հաստատել
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
