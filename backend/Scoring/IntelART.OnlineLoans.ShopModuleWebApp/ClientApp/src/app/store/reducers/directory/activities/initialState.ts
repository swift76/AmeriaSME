import { ISelectDataReceive } from 'app/store/reducers/common-models';

const initialState: IStoreActivities = {
    activitiesIsLoading: false,
    activitiesLoaded: false,
    activitiesFetchFail: false,
    data: []
};

export default initialState;

export interface IStoreActivities {
    readonly activitiesIsLoading: boolean;
    readonly activitiesLoaded: boolean;
    readonly activitiesFetchFail: boolean;
    readonly data: ISelectDataReceive[];
}
