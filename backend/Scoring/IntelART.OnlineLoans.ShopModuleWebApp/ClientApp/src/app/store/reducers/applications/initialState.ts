import { IGetApplicationsDataReceive, IGetApplicationsParams } from './models'

const initialState: IStoreApplications = {
    applocationsIsLoading: false,
    applocationsLoaded: false,
    applocationsFetchFail: false,
    params: {
        taxIdNumber: String(),
    },
    data: []
}

export default initialState;

export interface IStoreApplications {
    readonly applocationsIsLoading: boolean;
    readonly applocationsLoaded: boolean;
    readonly applocationsFetchFail: boolean;
    readonly params: IGetApplicationsParams;
    readonly data: IGetApplicationsDataReceive[]
}