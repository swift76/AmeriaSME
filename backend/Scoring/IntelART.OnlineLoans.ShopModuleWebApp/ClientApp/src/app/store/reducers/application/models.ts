// Application Get data
export interface IApplicationData {
    INITIAL_AMOUNT: number | null;
    CURRENCY_CODE: string;
    ANNUAL_TURNOVER: number | null;
    FIRST_NAME_EN: string;
    LAST_NAME_EN: string;
    SOCIAL_CARD_NUMBER: string;
    TAX_ID_NUMBER: string;
    MOBILE_PHONE: string;
    EMAIL: string;
    DOCUMENT_NUMBER: string;
    COMPANY_NAME: string;
    COMPANY_EMAIL: string;
    FACEBOOK: string;
    WEBSITE: string;
    IS_CURRENT_ADDRESS_SAME: boolean;
    CURRENT_COUNTRY_CODE: string;
    CURRENT_STATE_CODE: string;
    CURRENT_CITY_CODE: string;
    CURRENT_STREET: string;
    CURRENT_BUILDNUM: string;
    CURRENT_APARTMENT: string;
    IS_INDIVIDUAL_ADDRESS_SAME: boolean;
    INDIVIDUAL_COUNTRY_CODE: string;
    INDIVIDUAL_STATE_CODE: string;
    INDIVIDUAL_CITY_CODE: string;
    INDIVIDUAL_STREET: string;
    INDIVIDUAL_BUILDNUM: string;
    INDIVIDUAL_APARTMENT: string;
    ACTIVITY_CODE: string;
    FACTUAL_INDUSTRY_CODE: string;
    AGREED_WITH_TERMS: boolean;
    CLIENT_CODE: string;
    IS_DATA_COMPLETE: boolean;
    REFUSAL_REASON: string;
    MANUAL_REASON: string;
    IDENTIFICATION_REASON: string;
    ID: string;
    CREATION_DATE: Date;
    STATUS_ID: number;
    STATUS_AM: string;
    STATUS_EN: string;
    STATUS_STATE: string;
    LOAN_TYPE_ID: string;
    LOAN_TYPE_AM: string;
    LOAN_TYPE_EN: string;
    DISPLAY_AMOUNT: string;
    IS_SUBMIT: boolean;
    ISN: number;
    [key: string]: any;
}

export interface IGetApplicationError {
    readonly Data: string | null;
    readonly ErrorCode: string | null;
    readonly Inner: string | null;
    readonly Message: string;
    readonly StackTrace: string;
}
