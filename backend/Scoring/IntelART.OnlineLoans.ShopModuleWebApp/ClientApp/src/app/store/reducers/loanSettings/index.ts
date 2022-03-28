import * as AppTypes from 'AppTypes'

import initialState, { IStoreSettings } from './initialState'

import acTypes from './acTypes'

export const loanSettings = (
  stateStore: IStoreSettings = initialState,
  action: AppTypes.RootAction
): IStoreSettings => {
  switch (action.type) {
    case acTypes.GET_LOAN_SETTINGS_REQUEST: {
      return {
        ...stateStore,
        settingsIsLoading: true,
        settingsLoaded: false,
      }
    }

    case acTypes.GET_LOAN_SETTINGS_SUCCESS: {
      return {
        ...stateStore,
        settingsIsLoading: false,
        settingsLoaded: true,
        settings: { ...action.payload },
      }
    }

    case acTypes.GET_LOAN_UNSECUREDLIMITS_SUCCESS: {
      return {
        ...stateStore,
        unsecuredLimits: [...action.payload],
      }
    }

    case acTypes.GET_LOAN_FILEMAXSIZE_SUCCESS: {
      return {
        ...stateStore,
        fileMaxSize: action.payload,
      }
    }

    case acTypes.GET_LOAN_SETTINGS_FAIL: {
      return {
        ...stateStore,
        settingsIsLoading: false,
        settingsLoaded: false,
        settingsFetchFail: true,
        settings: initialState.settings,
      }
    }

    case acTypes.GET_LOAN_SPECIALIST_LOAN_TERMS_SUCCESS: {
      return {
        ...stateStore,
        lsLoanTerms: action.payload,
      }
    }

    default:
      return stateStore
  }
}
