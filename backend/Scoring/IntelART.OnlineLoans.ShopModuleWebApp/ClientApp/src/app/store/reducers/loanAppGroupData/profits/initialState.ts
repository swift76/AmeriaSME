import { IAppCompanyData } from '@store/reducers/common-models'

const initialState: IStoreProfits = {
    isLoading: false,
    isLoaded: false,
    isFail: false,
    data: []
}

export default initialState;

export interface IStoreProfits {
    readonly isLoading: boolean;
    readonly isLoaded: boolean;
    readonly isFail: boolean;
    readonly data: IAppCompanyData[]
}