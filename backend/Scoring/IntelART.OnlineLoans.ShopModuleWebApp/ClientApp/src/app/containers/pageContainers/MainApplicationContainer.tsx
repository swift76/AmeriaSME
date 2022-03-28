import * as AppTypes from 'AppTypes'

import {IGetMainApplicationData, IPostMainApplicationData} from '@store/reducers/mainApplication/models'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
  cancelApplicaton,
  getApplication,
  getMainApplication,
  getRefinansingLoan,
  getScoringResults,
  postRefinansingLoan,
  refuseApplication,
  saveMainApplication,
} from '@app/api/Application';

import { IModalOptions } from '@store/reducers/settings/modals/models';
import React from 'react'
import { connect } from 'react-redux'
import {
  getCurrencies,
} from '@app/api/Directory'
import {getLoanParameters} from '@app/api/Parameters/loanParameters'
import {modals} from '@store/reducers/settings/actions'
import {resetApplication} from '@store/reducers/application/actions'
import {resetMainApplication} from '@store/reducers/mainApplication/actions'
import {resetScoringResults} from '@store/reducers/scoringResults/actions'

export default (Page: React.FC<IMainAppProps>) => {
  const MainApplicationContainer = (props: IMainAppProps) => <Page {...props} />

  return withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(MainApplicationContainer)
  )
}

const mapDispatchToProps = (dispatch: AppTypes.DispatchActions) => {
  return {
    cancelApplicaton,
    refuseApplication,
    getRefinansingLoan,
    postRefinansingLoan,
    resetMainApplication: () => dispatch(resetMainApplication()),
    resetScoringResults: () => dispatch(resetScoringResults()),
    getApplication: (id: string) => dispatch(getApplication(id)),
    getCurrencies: (loanType: string) => dispatch(getCurrencies(loanType)),
    getLoanParameters: (loanTypeCode: string) => dispatch(getLoanParameters(loanTypeCode)),
    getMainApplication: (id: string) => dispatch(getMainApplication(id)),
    saveMainApplication: (id: string, data: IPostMainApplicationData) => dispatch(saveMainApplication(id, data)),
    resetApplication: () => dispatch(resetApplication()),
    getScoringResults: (id: string) => dispatch(getScoringResults(id)),
    openModal: (options: IModalOptions) => dispatch(modals.openModal(options)),
    closeModal: () => dispatch(modals.closeModal()),
    setModalOptions: (options: IModalOptions) => dispatch(modals.setModalOptions(options))
  };
}
​

const mapStateToProps = (state: AppTypes.ReducerState) => ({
  application: state.application,
  loanTypes: state.directory.loanTypes,
  currencies: state.directory.currencies,
  scoringResults: state.scoringResults,
  mainApplication: state.mainApplication,
  loanParameters: state.loanParameters
})


interface MatchParams {
  id: string;
}

export type IMainAppProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<MatchParams>
