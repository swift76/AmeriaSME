import * as AppTypes from 'AppTypes'

import { RouteComponentProps, withRouter } from 'react-router-dom'

import { IPostUserDataSend } from '@app/store/reducers/user/models'
import React from 'react'
import { connect } from 'react-redux'
import { userLogin } from 'app/api/User'

export default (Page: React.FC<ILoginProps>) => {
  const LoginContainer = (props: ILoginProps) => <Page {...props} />

  return withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(LoginContainer)
  )
}

const mapDispatchToProps = (dispatch: AppTypes.DispatchActions) => {
  return {
    userLogin: (data: IPostUserDataSend) => dispatch(userLogin(data)),
  };
}
​

const mapStateToProps = (state: AppTypes.ReducerState) => ({ user: state.user })

export type ILoginProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps
