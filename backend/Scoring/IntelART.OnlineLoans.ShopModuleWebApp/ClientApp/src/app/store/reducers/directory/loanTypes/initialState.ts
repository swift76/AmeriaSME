import { IGetRequestError, ISelectDataReceive } from 'app/store/reducers/common-models';

const initialState: IStoreLoanTypes = {
    loanTypesIsLoading: false,
    loanTypesLoaded: false,
    loanTypesFetchFail: false,
    data: []
};

export default initialState;

export interface IStoreLoanTypes {
    readonly loanTypesIsLoading: boolean;
    readonly loanTypesLoaded: boolean;
    readonly loanTypesFetchFail: boolean;
    readonly data: ISelectDataReceive[];
}
