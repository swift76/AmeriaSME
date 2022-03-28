import { IGetScoringResultsDataReceive } from './models'

const initialState: IStoreScoring = {
    scoringIsLoading: false,
    scoringLoaded: false,
    scoringFetchFail: false,
    data: []
}

export const initialScoringResult: IGetScoringResultsDataReceive = {
    APPROVED_AMOUNT_1: null,
    APPROVED_AMOUNT_2: null,
    REFINANCING_AMOUNT: null,
    INTEREST: null,
    TERM_FROM: null,
    TERM_TO: null,
    TEMPLATE_CODE: String(),
    TEMPLATE_NAME: String(),
}

export default initialState;

export interface IStoreScoring {
    readonly scoringIsLoading: boolean;
    readonly scoringLoaded: boolean;
    readonly scoringFetchFail: boolean;
    readonly data: IGetScoringResultsDataReceive[]

}