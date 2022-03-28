import React, { createContext } from 'react'

import { RouteConfig } from 'react-router-config'

export interface IAppContext {
  routes: RouteConfig[];
  locale?: string;
}

export const AppContext = createContext<IAppContext>({
  routes: [],
  locale: 'en',
})
