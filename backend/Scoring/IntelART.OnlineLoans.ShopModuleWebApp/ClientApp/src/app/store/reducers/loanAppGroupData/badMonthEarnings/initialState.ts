import { IAppCompanyData } from 'app/store/reducers/common-models';

const initialState: IStoreBadMonthEarnings = {
    isLoading: false,
    isLoaded: false,
    isFail: false,
    data: []
};

export default initialState;

export interface IStoreBadMonthEarnings {
    readonly isLoading: boolean;
    readonly isLoaded: boolean;
    readonly isFail: boolean;
    readonly data: IAppCompanyData[];
}
