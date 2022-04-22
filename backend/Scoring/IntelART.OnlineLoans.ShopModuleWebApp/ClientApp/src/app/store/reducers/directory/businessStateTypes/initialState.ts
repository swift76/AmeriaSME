import { ISelectDataReceive } from 'app/store/reducers/common-models';

const initialState: IStoreBusinessStateTypes = {
    businessStateTypesIsLoading: false,
    businessStateTypesLoaded: false,
    businessStateTypesFetchFail: false,
    data: []
};

export default initialState;

export interface IStoreBusinessStateTypes {
    readonly businessStateTypesIsLoading: boolean;
    readonly businessStateTypesLoaded: boolean;
    readonly businessStateTypesFetchFail: boolean;
    readonly data: ISelectDataReceive[];
}
