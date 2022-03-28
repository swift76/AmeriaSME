import { IAppRelatedPersons } from '@store/reducers/common-models'

const initialState: IStorePledgers = {
    isLoading: false,
    isLoaded: false,
    isFail: false,
    data: []
}

export default initialState;

export interface IStorePledgers {
    readonly isLoading: boolean;
    readonly isLoaded: boolean;
    readonly isFail: boolean;
    readonly data: IAppRelatedPersons[]
}