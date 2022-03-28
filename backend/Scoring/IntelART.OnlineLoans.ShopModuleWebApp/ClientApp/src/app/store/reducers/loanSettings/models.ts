// Application Get data
export interface IGetLoanSettingsDataReceive {
   readonly REPEAT_COUNT: number;
   readonly REPEAT_DAY_COUNT: number;
   readonly EXPIRE_DAY_COUNT: number;
   readonly CONTACT_DAY_COUNT: number;
   readonly LS_EXPIRE_DAY_COUNT: number;
}

export interface IGetLoanUnsecuredLimitsDataReceive {
   readonly CURRENCY: string;
   readonly AMOUNT: number;
}



export interface IGetSettingsError {
    readonly Data: string | null;
    readonly ErrorCode: string | null;
    readonly Inner: string | null;
    readonly Message: string;
    readonly StackTrace: string;
}