import * as AppTypes from 'AppTypes'

import initialState, { IStoreAddresses } from './initialState'

import acTypes from './acTypes'

export const addresses = (
  stateStore: IStoreAddresses = initialState,
  action: AppTypes.RootAction
): IStoreAddresses => {
  switch (action.type) {
    // addressCountries
    case acTypes.GET_ADDRESS_COUNTRIES_REQUEST: {
      return {
        ...stateStore,
        addressCountries: {
          ...stateStore.addressCountries,
          addressCountiresIsLoading: true,
          addressCountiresIsLoaded: false,
        },
      }
    }
    case acTypes.GET_ADDRESS_COUNTRIES_SUCCESS: {
      return {
        ...stateStore,
        addressCountries: {
          ...stateStore.addressCountries,
          addressCountiresIsLoading: false,
          addressCountiresIsLoaded: true,
          data: [...action.payload],
        },
      }
    }
    case acTypes.GET_ADDRESS_COUNTRIES_FAIL: {
      return {
        ...stateStore,
        addressCountries: {
          ...stateStore.addressCountries,
          addressCountiresIsLoading: false,
          addressCountiresIsLoaded: false,
          addressCountiresFetchFail: true,
        },
      }
    }
    // states
    case acTypes.GET_STATES_REQUEST: {
      return {
        ...stateStore,
        states: {
          ...stateStore.states,
          statesIsLoading: true,
          statesIsLoaded: false,
        },
      }
    }
    case acTypes.GET_STATES_SUCCESS: {
      return {
        ...stateStore,
        states: {
          ...stateStore.states,
          statesIsLoading: false,
          statesIsLoaded: true,
          data: [...action.payload],
        },
      }
    }
    case acTypes.GET_STATES_FAIL: {
      return {
        ...stateStore,
        states: {
          ...stateStore.states,
          statesIsLoading: false,
          statesIsLoaded: false,
          statesFetchFail: true,
        },
      }
    }
    // cities
    case acTypes.GET_CITIES_REQUEST: {
      return {
        ...stateStore,
        cities: {
          ...stateStore.cities,
          citiesIsLoading: true,
          citiesIsLoaded: false,
        },
      }
    }
    case acTypes.GET_CITIES_SUCCESS: {
      return {
        ...stateStore,
        cities: {
          ...stateStore.cities,
          citiesIsLoading: false,
          citiesIsLoaded: true,
          data: {
            ...stateStore.cities.data,
            ...action.payload,
          },
        },
      }
    }
    case acTypes.GET_CITIES_FAIL: {
      return {
        ...stateStore,
        cities: {
          ...stateStore.cities,
          citiesIsLoading: false,
          citiesIsLoaded: false,
          citiesFetchFail: true,
        },
      }
    }

    default:
      return stateStore
  }
}
