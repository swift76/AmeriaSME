import { IGetParametersDataReceive } from './models'

const initialState: IStoreParameters = {
    paramsIsLoading: false,
    paramsLoaded: false,
    paramsFetchFail: false,
    data: {
        REPAYMENT_DAY_FROM: 0,
        REPAYMENT_DAY_TO: 0,
        IS_OVERDRAFT: false,
        IS_CARD_ACCOUNT: false,
        IS_CREDIT_LINE: false,
        IS_SECURED: false,
        IS_ONLINE: false,
        IS_REPAY_DAY_FIXED: false,
        IS_REPAY_START_DAY: false,
        IS_REPAY_NEXT_MONTH: false,
        REPAY_TRANSITION_DAY: 0
    }
}

export default initialState;

export interface IStoreParameters {
    readonly paramsIsLoading: boolean;
    readonly paramsLoaded: boolean;
    readonly paramsFetchFail: boolean;
    readonly data: IGetParametersDataReceive,
}