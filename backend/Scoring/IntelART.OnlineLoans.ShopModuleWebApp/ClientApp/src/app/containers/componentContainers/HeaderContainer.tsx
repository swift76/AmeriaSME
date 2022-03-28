import * as AppTypes from 'AppTypes'

import { Dispatch, bindActionCreators } from 'redux'

import React from 'react'
import { connect } from 'react-redux'
import { getUserInfo } from 'app/api/User'
import { userActions } from '@store/reducers/root-actions'

export default (Component: React.FC<IHeaderProps>) => {
  const HeaderContainer = (props: IHeaderProps) => <Component {...props} />

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(HeaderContainer)
}

const mapDispatchToProps = (dispatch: Dispatch<AppTypes.RootAction>) =>
  bindActionCreators(
    { userLogout: userActions.userLogout, getUserInfo },
    dispatch
  )

const mapStateToProps = (state: AppTypes.ReducerState) => ({
  user: state.user,
})

export type IHeaderProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
