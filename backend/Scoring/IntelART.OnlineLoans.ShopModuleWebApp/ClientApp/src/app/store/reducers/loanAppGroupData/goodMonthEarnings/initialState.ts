import { IAppCompanyData } from 'app/store/reducers/common-models';

const initialState: IStoreGoodMonthEarnings = {
    isLoading: false,
    isLoaded: false,
    isFail: false,
    data: []
};

export default initialState;

export interface IStoreGoodMonthEarnings {
    readonly isLoading: boolean;
    readonly isLoaded: boolean;
    readonly isFail: boolean;
    readonly data: IAppCompanyData[];
}
