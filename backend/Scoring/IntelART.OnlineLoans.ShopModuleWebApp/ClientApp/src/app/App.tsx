import '../scss/index.scss';

import { AppContext } from './AppContext';
import Auth from 'app/containers/pageContainers/Auth';
import Authorization from 'app/containers/pageContainers/Authorization';
import Layout from './layout/Layout';
import { Provider } from 'react-redux';
import React from 'react';
import { Router } from 'react-router-dom';
import history from '../browserHistory';
import { routes } from './configs/routes';
import store from './store';

const App: React.FC = () => {
    return (
        <AppContext.Provider value={{ routes }}>
            <Provider store={store}>
                <Auth>
                    <Router history={history}>
                        <Authorization>
                            <Layout />
                        </Authorization>
                    </Router>
                </Auth>
            </Provider>
        </AppContext.Provider>
    );
};

export default App;
