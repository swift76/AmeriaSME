//Main Application Get data
export interface IGetMainApplicationData {
    AMOUNT: number
    CREATION_DATE: string
    CURRENCY_CODE: string
    DISPLAY_AMOUNT: number
    FINAL_AMOUNT: number
    ID: string
    INTEREST: number
    IS_REFINANCING: boolean
    IS_SUBMIT: boolean
    LOAN_TEMPLATE_CODE: string
    LOAN_TERM: string
    LOAN_TYPE_ID: string
    LOAN_TYPE_AM: string
    LOAN_TYPE_EN: string
    OVERDRAFT_TEMPLATE_CODE: string
    REPAYMENT_DAY: number
    STATUS_AM: string
    STATUS_EN: string
    STATUS_ID: number
    STATUS_STATE: string
}

export interface IPostMainApplicationData {
    CREATION_DATE: string;
    CURRENCY_CODE: string;
    ID: string;
    IS_SUBMIT: boolean;
    FINAL_AMOUNT: number;
    LOAN_TYPE_ID: string;
    INTEREST: number;
    LOAN_TERM: string;
    REPAYMENT_DAY: number;
    IS_REFINANCING:boolean
    LOAN_TEMPLATE_CODE?:string
    OVERDRAFT_TEMPLATE_CODE?: string
    STATUS_ID: number
    STATUS_STATE: string
}



export interface IRefinancingLoansData {
    APPLICATION_ID: string
    CURRENCY: string
    CURRENT_BALANCE: number
    DRAWDOWN_DATE: string
    INITIAL_AMOUNT: number
    INITIAL_INTEREST: number
    LOAN_CODE: number
    LOAN_TYPE: string
    MATURITY_DATE: string
    ORIGINAL_BANK_NAME: string
    ROW_ID: number
}
