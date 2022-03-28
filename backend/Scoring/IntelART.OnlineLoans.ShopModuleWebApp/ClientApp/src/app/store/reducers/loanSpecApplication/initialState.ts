import { ILoanSpecApplicationData } from './models'

const initialState: IStoreLoanSpecApplication = {
    applocationIsLoading: false,
    applocationLoaded: false,
    applocationFetchFail: false,
    data: {
        AMOUNT: Number(),
        APPRAISAL_COMPANY_CODE: String(),
        INSURANCE_COMPANY_CODE: String(),
        APPRAISAL_DATE: String(),
        APPROVED_AMOUNT: String(),
        AREA_RENTED_COMMENT: String(),
        BALANCES: [],
        BUSINESS_SPACE: Number(),
        BUSINESS_STATE_CODE: String(),
        COMPANY_NAME: String(),
        COSTS: [],
        CREATION_DATE: String(),
        CURRENCY_CODE: String(),
        DISPLAY_AMOUNT: String(),
        EMPLOYEE_COUNT: Number(),
        ESTATE_ADDRESS: String(),
        ESTATE_LAND_AREA: Number(),
        ESTATE_RESIDENTIAL_AREA: Number(),
        FAMILY_MEMBER_COUNT: Number(),
        FINAL_AMOUNT: Number(),
        GUARANTORS: [],
        ID: String(),
        INTEREST: Number(),
        IS_AREA_RENTED: Boolean(false),
        IS_INSURANCE_BY_BANK: Boolean(false),
        IS_INSURANCE_CONDITION: Boolean(false),
        IS_MAIN_AGREEMENT_SIGNED: Boolean(false),
        IS_REAL_ESTATE: Boolean(false),
        IS_REFINANCING: Boolean(false),
        IS_SUBMIT: Boolean(false),
        IS_SUCCESSIVE_PLEDGING: Boolean(false),
        LIQUID_PRICE: Number(),
        LOAN_TEMPLATE_CODE: String(),
        LOAN_TERM: String(),
        LOAN_TYPE_AM: String(),
        LOAN_TYPE_EN: String(),
        LOAN_TYPE_ID: String(),
        LS_CURRENCY_CODE: String(),
        LS_ENTRY_DATE: String(),
        LS_LOAN_AMOUNT: Number(),
        LS_LOAN_TERM: String(),
        LS_LOAN_TYPE_ID: String(),
        LS_REPAYMENT_DAY: Number(),
        MARKET_PRICE: Number(),
        NONOPERATIONAL_EXPENSES: [],
        OPERATIONAL_EXPENSES: [],
        OTHER_STATISTICS: [],
        OVERDRAFT_TEMPLATE_CODE: String(),
        OVERHEADS: [],
        GOOD_MONTH_EARNINGS: [],
        BAD_MONTH_EARNINGS: [],
        OWNERSHIP_CERTIFICATE_DATE: String(),
        OWNERSHIP_CERTIFICATE_NUMBER: String(),
        PLEDGERS: [],
        PROFITS: [],
        REPAYMENT_DAY: Number(),
        SHOULD_MAIN_AGREEMENT_SIGNED: Boolean(false),
        STATUS_AM: String(),
        STATUS_EN: String(),
        STATUS_ID: Number(),
        STATUS_STATE: String(),
        TAX_ID_NUMBER: String(),
        VEHICLE_COUNT: Number(),
        VEHICLE_MODEL: String(),
        VEHICLE_VIN: String(),
        VEHICLE_DATE: String(),
        ACTIVITY_DESCRIPTION: String()
    }
}

export default initialState;

export interface IStoreLoanSpecApplication {
    readonly applocationIsLoading: boolean;
    readonly applocationLoaded: boolean;
    readonly applocationFetchFail: boolean;
    readonly data: ILoanSpecApplicationData
}