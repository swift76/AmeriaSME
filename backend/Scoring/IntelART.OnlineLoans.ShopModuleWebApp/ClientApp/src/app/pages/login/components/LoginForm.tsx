import * as yup from 'yup'

import { Button, Form, Spinner } from 'react-bootstrap'

import { Formik } from 'formik'
import { IStoreUser } from '@app/store/reducers/user/initialState'
import React from 'react'
import { Utils } from 'app/services/utils'
import { resetUserLoginFail } from '@app/store/reducers/user/actions'
import { useDispatch } from 'react-redux'

export interface ILoginFormProps {
  user: IStoreUser;
  onValidSubmit: any;
}

const validationSchema = yup.object({
  Username: yup
    .string()
    .required(Utils.localizedClientErrors('USERNAME_REQUIRED')),
  Password: yup
    .string()
    .min(3, Utils.localizedClientErrors('PASSWORD_LENGTH'))
    .required(Utils.localizedClientErrors('PASSWORD_REQUIRED')),
})

const LoginForm: React.FC<ILoginFormProps> = (props: ILoginFormProps) => {
  const { userLoggingFail } = props.user
  const dispatch = useDispatch()
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ Username: '', Password: '' }}
      onSubmit={props.onValidSubmit}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form className="login-form" noValidate={true} onSubmit={handleSubmit}>
          <h2 className="form-title">Մուտք</h2>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Օգտատիրոջ անուն</Form.Label>
            <Form.Control
              type="text"
              name="Username"
              value={values.Username}
              onChange={(e: React.SyntheticEvent<any>) => {
                handleChange(e)
                userLoggingFail && dispatch(resetUserLoginFail())
              }}
              isValid={touched.Username && !errors.Username}
              isInvalid={
                (touched.Username && !!errors.Username) || userLoggingFail
              }
            />
            <Form.Text className="text-muted">
              Օգտագործեք բանկում գրանցված Ձեր օգտանունը (Օրինակ՝ Armen
              Armenakyan)
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.Username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Գաղտնաբառ</Form.Label>
            <Form.Control
              type="password"
              name="Password"
              value={values.Password}
              onChange={(e: React.SyntheticEvent<any>) => {
                handleChange(e)
                userLoggingFail && dispatch(resetUserLoginFail())
              }}
              isValid={touched.Password && !errors.Password}
              isInvalid={
                (touched.Password && !!errors.Password) || userLoggingFail
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.Password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicButton" className="text-right">
            <Button
              variant="primary"
              type="submit"
              disabled={props.user.userLoggingIn}
              block={true}
            >
              {props.user.userLoggingIn && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="mr-1"
                />
              )}
              Մուտք
            </Button>
          </Form.Group>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
