// Application Get data
export interface IGetParametersDataReceive {
   readonly REPAYMENT_DAY_FROM: number,
   readonly REPAYMENT_DAY_TO: number,
   readonly IS_OVERDRAFT: boolean,
   readonly IS_CARD_ACCOUNT: boolean,
   readonly IS_CREDIT_LINE: boolean,
   readonly IS_SECURED: boolean,
   readonly IS_ONLINE: boolean,
   readonly IS_REPAY_DAY_FIXED: boolean,
   readonly IS_REPAY_START_DAY: boolean,
   readonly IS_REPAY_NEXT_MONTH: boolean,
   readonly REPAY_TRANSITION_DAY: number
}