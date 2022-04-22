import * as AppTypes from 'AppTypes'

import React, { useEffect } from 'react'
import {
  getLoanSettings,
  getLoanSpecialistLoanTerms,
  getUnsecuredLimits,
  getFileMaxSize
} from 'app/api/Settings/loanSettings'

import JwtService from 'app/services/jwtService'
import { connect } from 'react-redux'

const Auth: React.FC<IAuthProps> = props => {
  JwtService.init()
  const { user, children } = props

  useEffect(() => {
    if (user.userLoggedIn) {
      props.getLoanSettings()
      props.getLoanSpecialistLoanTerms()
      props.getUnsecuredLimits()
      props.getFileMaxSize()
    }
  }, [user.userLoggedIn])

  return <>{children && children}</>
}

const mapDispatchToProps = (dispatch: AppTypes.DispatchActions) => {
  return {
    getLoanSettings: () => dispatch(getLoanSettings()),
    getLoanSpecialistLoanTerms: () => dispatch(getLoanSpecialistLoanTerms()),
    getUnsecuredLimits: () => dispatch(getUnsecuredLimits()),
    getFileMaxSize: () => dispatch(getFileMaxSize()),
  }
}

const mapStateToProps = (state: AppTypes.ReducerState) => ({
  user: state.user,
})

export type IAuthProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth)
