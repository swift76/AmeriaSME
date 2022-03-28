import * as AppTypes from 'AppTypes'

import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
  getActivities,
  getAddressCountries,
  getCities,
  getIndustries,
  getStates,
} from '@app/api/Directory'
import {getApplication, getLatestApplication, saveApplication} from '@app/api/Application'

import { IApplicationData } from '@store/reducers/application/models';
import { IModalOptions } from '@store/reducers/settings/modals/models';
import React from 'react'
import { connect } from 'react-redux'
import {modals} from '@store/reducers/settings/actions'
import {resetApplication} from '@store/reducers/application/actions'

export default (Page: React.FC<IShortAppProps>) => {
  const ShortApplicationContainer = (props: IShortAppProps) => <Page {...props} />

  return withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ShortApplicationContainer)
  )
}

const mapDispatchToProps = (dispatch: AppTypes.DispatchActions) => {
  return {
    getApplication: (id: string) => dispatch(getApplication(id)),
    getLatestApplication: (taxIdNumber: string) => dispatch(getLatestApplication(taxIdNumber)),
    getIndustries: () => dispatch(getIndustries()),
    getAddressCountries: () => dispatch(getAddressCountries()),
    getStates: () => dispatch(getStates()),
    getCities: (stateCode: string) => dispatch(getCities(stateCode)),
    getActivities: () => dispatch(getActivities()),
    resetApplication: () => dispatch(resetApplication()),
    saveApplication: (data: IApplicationData) => dispatch(saveApplication(data)),
    openModal: (options: IModalOptions) => dispatch(modals.openModal(options)),
    closeModal: () => dispatch(modals.closeModal()),
    setModalOptions: (options: IModalOptions) => dispatch(modals.setModalOptions(options))
  };
}
​

const mapStateToProps = (state: AppTypes.ReducerState) => ({
  params: state.applications.params,
  application: state.application,
  industires: state.directory.facutalIndustires,
  loanTypes: state.directory.loanTypes,
  addresses: state.directory.addresses,
  activities: state.directory.activities,
  modal: state.settings.modal
})


interface MatchParams {
  id: string;
}

export type IShortAppProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<MatchParams>
