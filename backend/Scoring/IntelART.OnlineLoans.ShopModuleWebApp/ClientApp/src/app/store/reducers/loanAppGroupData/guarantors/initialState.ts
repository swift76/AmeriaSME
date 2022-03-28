import { IAppRelatedPersons } from '@store/reducers/common-models'

const initialState: IStoreGuarantors = {
    isLoading: false,
    isLoaded: false,
    isFail: false,
    data: []
}

export default initialState;

export interface IStoreGuarantors {
    readonly isLoading: boolean;
    readonly isLoaded: boolean;
    readonly isFail: boolean;
    readonly data: IAppRelatedPersons[]
}