import LoginContainer, { ILoginProps } from '@pageContainers/LoginContainer'

import { IPostUserDataSend } from '@app/store/reducers/user/models'
import LoginForm from './components/LoginForm'
import React from 'react'

const Page: React.FC<ILoginProps> = (props: ILoginProps) => {
  const { userLogin, user } = props

  const onValidSubmit = (values: IPostUserDataSend) => {
    userLogin({
      ...values,
    })
  }

  return (
    <div className="page login-page">
      <div className="login-form-wrap">
        <img src="/assets/images/logos/logo-t.png" className="logo" />
        <LoginForm user={user} onValidSubmit={onValidSubmit}></LoginForm>
      </div>
    </div>
  )
}

const LoginPage = LoginContainer(Page)

export default LoginPage
