// Application Get data
export interface IGetApplicationsDataReceive {
   readonly AMOUNT: number;
   readonly CREATION_DATE: string;
   readonly DISPLAY_AMOUNT: string;
   readonly COMPANY_NAME: string;
   readonly ID: string;
   readonly IS_AVAILABLE: boolean;
   readonly IS_SUBMIT: boolean;
   readonly LOAN_SPECIALIST_NAME: string;
   readonly LOAN_TYPE_AM: string;
   readonly LOAN_TYPE_EN: string;
   readonly LOAN_TYPE_ID: string;
   readonly STATUS_AM: string;
   readonly STATUS_EN: string;
   readonly STATUS_ID: number;
   readonly STATUS_STATE: string;
   readonly TERM_DAYS: number;
   readonly MANUAL_REASON: string;
}

export interface IGetApplicationsParams {
    readonly taxIdNumber: string
}

export interface IGetApplicationsError {
    readonly Data: string | null;
    readonly ErrorCode: string | null;
    readonly Inner: string | null;
    readonly Message: string;
    readonly StackTrace: string;
}