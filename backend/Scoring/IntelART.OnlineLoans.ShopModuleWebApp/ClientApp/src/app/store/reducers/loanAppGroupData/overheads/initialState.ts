import { IOverheadsData } from '@store/reducers/common-models'

const initialState: IStoreOverheads = {
    isLoading: false,
    isLoaded: false,
    isFail: false,
    data: []
}

export default initialState;

export interface IStoreOverheads {
    readonly isLoading: boolean;
    readonly isLoaded: boolean;
    readonly isFail: boolean;
    readonly data: IOverheadsData[]
}