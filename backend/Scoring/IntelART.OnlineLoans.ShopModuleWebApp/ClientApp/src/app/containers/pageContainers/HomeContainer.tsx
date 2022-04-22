import * as AppTypes from 'AppTypes'

import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
  resetApplications,
  setApplicationsParams,
} from 'app/store/reducers/applications/actions'

import { IGetApplicationsParams } from 'app/store/reducers/applications/models'
import React from 'react'
import { connect } from 'react-redux'
import { getApplications } from 'app/api/Applications'

export default (Page: React.FC<IHomeProps>) => {
  const HomeContainer = (props: IHomeProps) => <Page {...props} />

  return withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(HomeContainer)
  )
}

const mapDispatchToProps = (dispatch: AppTypes.DispatchActions) => {
  return {
    getApplications: (params: IGetApplicationsParams) =>
      dispatch(getApplications(params)),
    setApplicationsParams: (params: IGetApplicationsParams) =>
      dispatch(setApplicationsParams(params)),
    resetApplications: () => dispatch(resetApplications()),
  }
}

const mapStateToProps = (state: AppTypes.ReducerState) => ({
  applications: state.applications,
  loanSettings: state.loanSettings,
})

export type IHomeProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps
