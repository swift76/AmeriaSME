// Application Get data
export interface IGetScoringResultsDataReceive {
   readonly APPROVED_AMOUNT_1: number | null,
   readonly APPROVED_AMOUNT_2: number | null,
   readonly REFINANCING_AMOUNT: number | null,
   readonly INTEREST: number | null,
   readonly TERM_FROM: number | null,
   readonly TERM_TO: number | null,
   readonly TEMPLATE_CODE: string,
   readonly TEMPLATE_NAME: string
}