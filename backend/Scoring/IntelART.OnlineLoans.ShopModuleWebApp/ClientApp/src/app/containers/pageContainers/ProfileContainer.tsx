import * as AppTypes from 'AppTypes'

import { RouteComponentProps, withRouter } from 'react-router-dom'

import { IChangePasswordDataSend } from '@app/store/reducers/user/models'
import React from 'react'
import { connect } from 'react-redux'
import { userchangePassword } from 'app/api/User'

export default (Page: React.FC<IProfileProps>) => {
  const ProfileContainer = (props: IProfileProps) => <Page {...props} />

  return withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ProfileContainer)
  )
}

const mapDispatchToProps = (dispatch: AppTypes.DispatchActions) => {
  return {
    changePassword: (data: IChangePasswordDataSend) => dispatch(userchangePassword(data)),
  };
}
​

const mapStateToProps = (state: AppTypes.ReducerState) => ({ user: state.user })

export type IProfileProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps
