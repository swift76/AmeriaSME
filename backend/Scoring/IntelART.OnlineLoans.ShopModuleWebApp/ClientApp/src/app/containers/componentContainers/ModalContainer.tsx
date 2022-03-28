import * as AppTypes from 'AppTypes'

import { Dispatch, bindActionCreators } from 'redux'

import React from 'react'
import { connect } from 'react-redux'
import { settingsActions } from '@store/reducers/root-actions'

const { openModal, closeModal } = settingsActions.modals

export default (Component: React.FC<IModalProps>) => {
  const ModalContainer = (props: IModalProps) => <Component {...props} />

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalContainer)
}

const mapDispatchToProps = (dispatch: Dispatch<AppTypes.RootAction>) =>
  bindActionCreators({ openModal, closeModal }, dispatch)

const mapStateToProps = (state: AppTypes.ReducerState) => ({
  modal: state.settings.modal,
})

export type IModalProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>
