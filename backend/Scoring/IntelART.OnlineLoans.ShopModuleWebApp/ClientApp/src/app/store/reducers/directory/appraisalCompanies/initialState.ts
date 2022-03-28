import { ISelectDataReceive } from '@store/reducers/common-models'

const initialState: IStoreAppraisalCompanies = {
    isLoading: false,
    isLoaded: false,
    isFetchFail: false,
    data: []
}

export default initialState;

export interface IStoreAppraisalCompanies {
    readonly isLoading: boolean;
    readonly isLoaded: boolean;
    readonly isFetchFail: boolean;
    readonly data: ISelectDataReceive[]
}