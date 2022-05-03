import { ISelectDataReceive } from 'app/store/reducers/common-models';

const initialState: IStoreIndustryTypes = {
    industryIsLoading: false,
    industryIsLoaded: false,
    industryIsFail: false,
    data: []
};

export default initialState;

export interface IStoreIndustryTypes {
    readonly industryIsLoading: boolean;
    readonly industryIsLoaded: boolean;
    readonly industryIsFail: boolean;
    readonly data: ISelectDataReceive[];
}
