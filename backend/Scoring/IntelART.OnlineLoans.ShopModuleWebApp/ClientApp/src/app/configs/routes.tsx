import React from 'react'
import { Redirect } from 'react-router-dom'
import { RouteConfig } from 'react-router-config'
import { pagesConfigs } from 'app/pages/pagesConfigs'

export const routes: RouteConfig[] = [
  ...pagesConfigs,
  {
    path: '/',
    component: () => <Redirect to="/login" />,
  },
  {
    component: () => <Redirect to="/errors/404" />,
  },
]
