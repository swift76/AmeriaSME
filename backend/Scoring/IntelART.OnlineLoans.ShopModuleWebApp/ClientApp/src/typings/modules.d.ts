declare module "AppTypes" {
    import { StateType, ActionType } from "typesafe-actions";
    import { ThunkDispatch } from 'redux-thunk';
    import { Action } from 'redux'
    // 1 for reducer, 1 for action creators
    export type Store = StateType<typeof import('../app/store').default>;
    export type ReducerState = StateType<typeof import("../app/store/reducers/root-reducers").default>;
    export type RootAction = ActionType<typeof import("../app/store/reducers/root-actions")>;
    export type DispatchActions = ThunkDispatch<RootAction, void, Action>;
}