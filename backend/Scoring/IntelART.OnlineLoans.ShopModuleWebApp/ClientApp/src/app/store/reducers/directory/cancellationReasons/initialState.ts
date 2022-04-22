import { ISelectDataReceive } from 'app/store/reducers/common-models';

const initialState: IStoreCancelReasons = {
    cancelReasonsIsLoading: false,
    cancelReasonsLoaded: false,
    cancelReasonsFetchFail: false,
    data: []
};

export default initialState;

export interface IStoreCancelReasons {
    readonly cancelReasonsIsLoading: boolean;
    readonly cancelReasonsLoaded: boolean;
    readonly cancelReasonsFetchFail: boolean;
    readonly data: ISelectDataReceive[];
}
