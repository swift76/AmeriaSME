import { IGetLoanLimitsDataReceive } from './models'

const initialState: IStoreLimits = {
    limitsIsLoading: false,
    limitsLoaded: false,
    limitsFetchFail: false,
    data: {
        FROM_AMOUNT: 0,
        TO_AMOUNT: 0
    }
}

export default initialState;

export interface IStoreLimits {
    readonly limitsIsLoading: boolean;
    readonly limitsLoaded: boolean;
    readonly limitsFetchFail: boolean;
    readonly data: IGetLoanLimitsDataReceive,
}