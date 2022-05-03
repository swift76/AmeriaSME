// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { Suspense, useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';

import { AppContext } from 'app/AppContext';
import Header from './components/Header';
import Loading from 'app/components/Loading';
import LoanModal from './components/Modal';
import { ToastContainer } from 'react-toastify';

const Layout: React.FC<RouteComponentProps> = ({ children, location }) => {
    const { routes } = useContext(AppContext);
    const matched = matchRoutes(routes, location.pathname)[0];
    const settings = matched && matched.route.settings;
    return (
        <>
            <main id="main-layout">
                {settings && settings.header && <Header />}
                <Suspense fallback={<Loading />}>{renderRoutes(routes)}</Suspense>
                {children}
            </main>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                pauseOnHover={true}
            />
            <LoanModal />
        </>
    );
};

export default withRouter(Layout);
