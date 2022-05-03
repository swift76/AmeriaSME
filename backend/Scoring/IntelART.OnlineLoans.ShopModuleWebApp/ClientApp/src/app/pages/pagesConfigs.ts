// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';

const defaultSettings: Isettings = {
    header: true
};

export const pagesConfigs = [
    {
        path: '/',
        exact: true,
        component: React.lazy(() => import('./home/HomePage')),
        auth: true,
        settings: { ...defaultSettings }
    },
    {
        path: '/login',
        exact: true,
        component: React.lazy(() => import('./login/LoginPage')),
        auth: false,
        settings: {
            header: false
        }
    },
    {
        path: '/profile',
        exact: true,
        component: React.lazy(() => import('./profile/ProfilePage')),
        auth: true,
        settings: { ...defaultSettings }
    },
    {
        path: '/application/short',
        exact: true,
        component: React.lazy(() => import('./application/Shortapplication')),
        auth: true,
        settings: { ...defaultSettings }
    },
    {
        path: '/application/short/:id',
        exact: true,
        component: React.lazy(() => import('./application/Shortapplication')),
        auth: true,
        settings: { ...defaultSettings }
    },
    {
        path: '/application/main/:id',
        exact: true,
        component: React.lazy(() => import('./application/MainApplication')),
        auth: true,
        settings: { ...defaultSettings }
    },
    {
        path: '/application/advance/:id/results',
        exact: true,
        component: React.lazy(() => import('./application/AdvApplicationResults')),
        auth: true,
        settings: { ...defaultSettings }
    },
    {
        path: '/application/advance/:id',
        exact: true,
        component: React.lazy(() => import('./application/AdvanceApplication')),
        auth: true,
        settings: { ...defaultSettings }
    },
    {
        path: '/errors/404',
        exact: true,
        component: React.lazy(() => import('./errors/Error404Page')),
        auth: false,
        settings: { ...defaultSettings }
    }
];

export interface Isettings {
    header: boolean;
}
