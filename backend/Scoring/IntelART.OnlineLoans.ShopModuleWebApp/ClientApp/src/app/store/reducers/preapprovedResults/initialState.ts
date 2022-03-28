import { IPreApprovedResultsData } from './models'

const initialState: IStoreMainApplication = {
    resultsIsLoading: false,
    resultsIsLoaded: false,
    resultsIsFail: false,
    data: []
}

export default initialState;

export interface IStoreMainApplication {
    readonly resultsIsLoading: boolean;
    readonly resultsIsLoaded: boolean;
    readonly resultsIsFail: boolean;
    data: IPreApprovedResultsData[]
}
