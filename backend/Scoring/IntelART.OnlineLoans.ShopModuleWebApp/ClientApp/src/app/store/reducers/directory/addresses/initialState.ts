import { ISelectDataReceive } from 'app/store/reducers/common-models';

const initialState: IStoreAddresses = {
    addressCountries: {
        addressCountiresIsLoading: false,
        addressCountiresIsLoaded: false,
        addressCountiresFetchFail: false,
        data: []
    },
    states: {
        statesIsLoading: false,
        statesIsLoaded: false,
        statesFetchFail: false,
        data: []
    },
    cities: {
        citiesIsLoading: false,
        citiesIsLoaded: false,
        citiesFetchFail: false,
        data: {}
    }
};

export default initialState;

export interface IStoreAddresses {
    readonly addressCountries: {
        readonly addressCountiresIsLoading: boolean;
        readonly addressCountiresIsLoaded: boolean;
        readonly addressCountiresFetchFail: boolean;
        readonly data: ISelectDataReceive[];
    };
    readonly states: {
        readonly statesIsLoading: boolean;
        readonly statesIsLoaded: boolean;
        readonly statesFetchFail: boolean;
        readonly data: ISelectDataReceive[];
    };
    readonly cities: {
        readonly citiesIsLoading: boolean;
        readonly citiesIsLoaded: boolean;
        readonly citiesFetchFail: boolean;
        readonly data: {
            [name: string]: ISelectDataReceive[];
        };
    };
}
