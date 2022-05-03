import { ReducerState, RootAction } from 'AppTypes';
import { applyMiddleware, compose, createStore } from 'redux';

import acTypes from 'app/store/reducers/user/acTypes';
import rootReducer from './reducers/root-reducers';
import thunk from 'redux-thunk';

const composeEnhancers =
    (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

// compose enhancers
const enhancer = composeEnhancers(applyMiddleware(thunk));
// rehydrate state on app start
const initialState = {};

// const rootReducer = (state: ReducerState, action: RootAction) => {
//   action.type === acTypes.USER_LOGOUT && state = undefined
//   return appReducer(state, action)
// }

const store = createStore(rootReducer, initialState, enhancer);

export default store;
