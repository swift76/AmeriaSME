import { IGetRequestError, ISelectDataReceive } from 'app/store/reducers/common-models';

const initialState: IStoreInsuranceCompanies = {
    industiresIsLoading: false,
    industiresLoaded: false,
    industiresFetchFail: false,
    data: []
};

export default initialState;

export interface IStoreInsuranceCompanies {
    readonly industiresIsLoading: boolean;
    readonly industiresLoaded: boolean;
    readonly industiresFetchFail: boolean;
    readonly data: ISelectDataReceive[];
}
