import * as AppTypes from 'AppTypes'

import initialState, { IStoreCurrencies } from './initialState'

import acTypes from './acTypes'

export const currencies = (
  stateStore: IStoreCurrencies = initialState,
  action: AppTypes.RootAction
): IStoreCurrencies => {
  switch (action.type) {
    case acTypes.GET_CURRENCIES_REQUEST: {
      return {
        ...stateStore,
        currenciesIsLoading: true,
        currenciesLoaded: false,
      }
    }

    case acTypes.GET_CURRENCIES_SUCCESS: {
      return {
        ...stateStore,
        currenciesIsLoading: false,
        currenciesLoaded: true,
        data: {
          ...stateStore.data,
          ...action.payload,
        },
      }
    }

    case acTypes.GET_CURRENCIES_FAIL: {
      return {
        ...stateStore,
        currenciesIsLoading: false,
        currenciesLoaded: false,
        currenciesFetchFail: true,
      }
    }

    default:
      return stateStore
  }
}
