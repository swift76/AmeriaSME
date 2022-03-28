import { IGetMainApplicationData } from './models'

const initialState: IStoreMainApplication = {
    mainApplocationIsLoading: false,
    mainApplocationLoaded: false,
    mainApplocationFetchFail: false,
    data: {
        AMOUNT: Number(),
        CREATION_DATE: String(),
        CURRENCY_CODE: String(),
        DISPLAY_AMOUNT:  Number(),
        FINAL_AMOUNT:  Number(),
        ID: String(),
        INTEREST:  Number(),
        IS_REFINANCING: Boolean(false),
        IS_SUBMIT: Boolean(false),
        LOAN_TEMPLATE_CODE: String(),
        LOAN_TERM: String(),
        LOAN_TYPE_ID: String(),
        LOAN_TYPE_AM: String(),
        LOAN_TYPE_EN: String(),
        OVERDRAFT_TEMPLATE_CODE: String(),
        REPAYMENT_DAY:  Number(),
        STATUS_AM: String(),
        STATUS_EN: String(),
        STATUS_ID:  Number(),
        STATUS_STATE: String(),
    }
}

export default initialState;

export interface IStoreMainApplication {
    readonly mainApplocationIsLoading: boolean;
    readonly mainApplocationLoaded: boolean;
    readonly mainApplocationFetchFail: boolean;
    data: IGetMainApplicationData
}
