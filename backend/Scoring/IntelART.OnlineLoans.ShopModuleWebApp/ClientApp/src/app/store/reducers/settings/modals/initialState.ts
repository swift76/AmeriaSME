import {IModalOptions} from './models'

const initialState: IStoreModal = {
    state : false,
    options: {
        children: '',
        loading: false,
        title: 'Կատարվում է հարցում՝',
        modalProps: {
            backdrop: 'static',
        },
        closeButton: true,
        headerProps: {}
    }
}

export default initialState;


export interface IStoreModal {
    readonly state: boolean;
    readonly options: IModalOptions
}