import { IGetRequestError, ISelectDataReceive } from 'app/store/reducers/common-models';

const initialState: IStorePledgeTypes = {
    loanTypesIsLoading: false,
    loanTypesLoaded: false,
    loanTypesFetchFail: false,
    data: []
};

export default initialState;

export interface IStorePledgeTypes {
    readonly loanTypesIsLoading: boolean;
    readonly loanTypesLoaded: boolean;
    readonly loanTypesFetchFail: boolean;
    readonly data: ISelectDataReceive[];
}
