import { ISelectDataReceive } from 'app/store/reducers/common-models';

const initialState: IStoreIndustryProducts = {
    industryIsLoading: false,
    industryIsLoaded: false,
    industryIsFail: false,
    data: []
};

export default initialState;

export interface IStoreIndustryProducts {
    readonly industryIsLoading: boolean;
    readonly industryIsLoaded: boolean;
    readonly industryIsFail: boolean;
    readonly data: ISelectDataReceive[];
}
