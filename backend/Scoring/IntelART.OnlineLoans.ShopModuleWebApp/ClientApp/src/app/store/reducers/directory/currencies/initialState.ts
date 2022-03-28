import { ISelectDataReceive } from '@store/reducers/common-models'

const initialState: IStoreCurrencies = {
    currenciesIsLoading: false,
    currenciesLoaded: false,
    currenciesFetchFail: false,
    data: {}
}

export default initialState;

export interface IStoreCurrencies {
    readonly currenciesIsLoading: boolean;
    readonly currenciesLoaded: boolean;
    readonly currenciesFetchFail: boolean;
    readonly data: {
        [name: string]: ISelectDataReceive[]
    }
}