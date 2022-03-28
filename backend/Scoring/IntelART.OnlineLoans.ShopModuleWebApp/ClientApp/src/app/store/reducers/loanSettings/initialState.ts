import { IGetLoanSettingsDataReceive, IGetLoanUnsecuredLimitsDataReceive } from './models'

const initialState: IStoreSettings = {
    settingsIsLoading: false,
    settingsLoaded: false,
    settingsFetchFail: false,
    settings: {
        REPEAT_COUNT: Number(),
        REPEAT_DAY_COUNT: Number(),
        EXPIRE_DAY_COUNT: Number(),
        CONTACT_DAY_COUNT: Number(),
        LS_EXPIRE_DAY_COUNT: Number()
    },
    unsecuredLimits: [],
    fileMaxSize: Number(),
    lsLoanTerms: []
}

export default initialState;

export interface IStoreSettings {
    readonly settingsIsLoading: boolean;
    readonly settingsLoaded: boolean;
    readonly settingsFetchFail: boolean;
    readonly settings: IGetLoanSettingsDataReceive
    readonly unsecuredLimits: IGetLoanUnsecuredLimitsDataReceive[],
    readonly fileMaxSize: number,
    readonly lsLoanTerms: string[],
}