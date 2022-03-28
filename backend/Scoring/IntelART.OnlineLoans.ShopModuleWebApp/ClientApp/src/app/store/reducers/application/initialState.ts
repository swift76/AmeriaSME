import { IApplicationData } from './models'

const initialState: IStoreApplication = {
    applocationIsLoading: false,
    applocationLoaded: false,
    applocationFetchFail: false,
    data: {
        INITIAL_AMOUNT: null,
        CURRENCY_CODE: String(),
        ANNUAL_TURNOVER: null,
        FIRST_NAME_EN: String(),
        LAST_NAME_EN: String(),
        SOCIAL_CARD_NUMBER: String(),
        TAX_ID_NUMBER: String(),
        MOBILE_PHONE: String(),
        EMAIL: String(),
        DOCUMENT_NUMBER: String(),
        COMPANY_NAME: String(),
        COMPANY_EMAIL: String(),
        FACEBOOK: String(),
        WEBSITE: String(),
        IS_CURRENT_ADDRESS_SAME: Boolean(false),
        CURRENT_COUNTRY_CODE: String(),
        CURRENT_STATE_CODE: String(),
        CURRENT_CITY_CODE: String(),
        CURRENT_STREET: String(),
        CURRENT_BUILDNUM: String(),
        CURRENT_APARTMENT: String(),
        IS_INDIVIDUAL_ADDRESS_SAME: Boolean(false),
        INDIVIDUAL_COUNTRY_CODE: String(),
        INDIVIDUAL_STATE_CODE: String(),
        INDIVIDUAL_CITY_CODE: String(),
        INDIVIDUAL_STREET: String(),
        INDIVIDUAL_BUILDNUM: String(),
        INDIVIDUAL_APARTMENT: String(),
        ACTIVITY_CODE: String(),
        FACTUAL_INDUSTRY_CODE: String(),
        AGREED_WITH_TERMS:  Boolean(false),
        CLIENT_CODE: String(),
        IS_DATA_COMPLETE:  Boolean(false),
        REFUSAL_REASON: String(),
        MANUAL_REASON: String(),
        IDENTIFICATION_REASON: String(),
        ID: String(),
        CREATION_DATE: new Date(),
        STATUS_ID: Number(),
        STATUS_AM: String(),
        STATUS_EN: String(),
        STATUS_STATE: String(),
        LOAN_TYPE_ID: String(),
        LOAN_TYPE_AM: String(),
        LOAN_TYPE_EN: String(),
        DISPLAY_AMOUNT: String(),
        IS_SUBMIT: false,
        ISN: Number(),
    }
}

export default initialState;

export interface IStoreApplication {
    readonly applocationIsLoading: boolean;
    readonly applocationLoaded: boolean;
    readonly applocationFetchFail: boolean;
    readonly data: IApplicationData
}
