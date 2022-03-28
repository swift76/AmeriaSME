//Main Application Get data
export interface IPreApprovedResultsData {
  ID: number;
  IS_REFINANCING: boolean;
  APPROVED_AMOUNT: number;
  INTEREST: number;
  LOAN_TERM: number;
  REQUIRED_REAL_ESTATE: number;
  REQUIRED_MOVABLE_ESTATE: number;
  MONTHLY_PAYMENT_AMOUNT: number;
}

export interface IPreApprovedResultsGroupData {
  term: string;
  scorings: IPreApprovedResultsData[];
}

export interface IPreApprovedResultsPostData {
  Id: number;
  IsRealEstate?: boolean;
}
