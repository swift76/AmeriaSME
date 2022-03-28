import {
  IAppCompanyData,
  IAppRelatedPersons,
  IOverheadsData,
} from '../common-models'

//LOAN SPECIALISR Application Get data Interface
export interface ILoanSpecApplicationData {
  TAX_ID_NUMBER: string;
  COMPANY_NAME: string;
  BUSINESS_SPACE: number;
  BUSINESS_STATE_CODE: string;
  EMPLOYEE_COUNT: number;
  FAMILY_MEMBER_COUNT: number;
  VEHICLE_COUNT: number;
  LS_LOAN_TYPE_ID: string;
  LS_LOAN_AMOUNT: number;
  LS_CURRENCY_CODE: string;
  LS_LOAN_TERM: string;
  LS_REPAYMENT_DAY: number;
  LS_ENTRY_DATE: string;
  IS_AREA_RENTED: boolean;
  AREA_RENTED_COMMENT: string;
  APPROVED_AMOUNT: string;
  PROFITS: IAppCompanyData[];
  OVERHEADS: IOverheadsData[];
  COSTS: IAppCompanyData[];
  BALANCES: IAppCompanyData[];
  OPERATIONAL_EXPENSES: IAppCompanyData[];
  NONOPERATIONAL_EXPENSES: IAppCompanyData[];
  OTHER_STATISTICS: IAppCompanyData[];
  GOOD_MONTH_EARNINGS: IAppCompanyData[];
  BAD_MONTH_EARNINGS: IAppCompanyData[];
  GUARANTORS: IAppRelatedPersons[];
  IS_REAL_ESTATE: boolean;
  SHOULD_MAIN_AGREEMENT_SIGNED: boolean;
  IS_MAIN_AGREEMENT_SIGNED: boolean;
  IS_SUCCESSIVE_PLEDGING: boolean;
  MARKET_PRICE: number;
  LIQUID_PRICE: number;
  IS_INSURANCE_CONDITION: boolean;
  IS_INSURANCE_BY_BANK: boolean;
  APPRAISAL_COMPANY_CODE: string;
  INSURANCE_COMPANY_CODE: string;
  APPRAISAL_DATE: string;
  ESTATE_ADDRESS: string;
  ESTATE_RESIDENTIAL_AREA: number;
  ESTATE_LAND_AREA: number;
  OWNERSHIP_CERTIFICATE_NUMBER: string;
  OWNERSHIP_CERTIFICATE_DATE: string;
  VEHICLE_MODEL: string;
  VEHICLE_VIN: string;
  VEHICLE_DATE: string;
  PLEDGERS: IAppRelatedPersons[];
  REPAYMENT_DAY: number;
  FINAL_AMOUNT: number;
  INTEREST: number;
  CURRENCY_CODE: string;
  LOAN_TERM: string;
  IS_REFINANCING: boolean;
  LOAN_TEMPLATE_CODE: string;
  OVERDRAFT_TEMPLATE_CODE: string;
  ID: string;
  CREATION_DATE: string;
  STATUS_ID: number;
  STATUS_AM: string;
  STATUS_EN: string;
  STATUS_STATE: string;
  AMOUNT: number;
  LOAN_TYPE_ID: string;
  LOAN_TYPE_AM: string;
  LOAN_TYPE_EN: string;
  DISPLAY_AMOUNT: string;
  ACTIVITY_DESCRIPTION: string
  IS_SUBMIT: boolean;
  C01?: boolean;
  A01?: boolean;
}
