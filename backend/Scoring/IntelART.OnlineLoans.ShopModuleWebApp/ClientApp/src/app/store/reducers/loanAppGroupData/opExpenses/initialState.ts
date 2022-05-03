import { IAppCompanyData } from 'app/store/reducers/common-models';

const initialState: IStoreOpExpanses = {
    isLoading: false,
    isLoaded: false,
    isFail: false,
    data: []
};

export default initialState;

export interface IStoreOpExpanses {
    readonly isLoading: boolean;
    readonly isLoaded: boolean;
    readonly isFail: boolean;
    readonly data: IAppCompanyData[];
}
