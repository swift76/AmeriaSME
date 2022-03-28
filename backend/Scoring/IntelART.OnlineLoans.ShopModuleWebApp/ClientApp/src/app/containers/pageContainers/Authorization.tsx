import * as AppTypes from 'AppTypes'

import {AppContext, IAppContext} from 'app/AppContext'
import {RouteComponentProps, withRouter} from 'react-router';

import React from 'react';
import { connect } from 'react-redux'
import { matchRoutes } from 'react-router-config'

class Authorization extends React.Component<IProps, IState> {

    public static contextType = AppContext

    public static getDerivedStateFromProps(props: IProps, state: IState) {
        const { location, user } = props
        const {userLoggedIn} = user
        const matched = matchRoutes(state.routes, location.pathname)[0]


        const hasRouteAccess = matched && matched.route.auth ?
        userLoggedIn : userLoggedIn && !matched.route.auth ? false : true


        return { hasRouteAccess }
    }

    constructor(props: IProps, context: IAppContext) {
        super(props);
        const { routes } = context
        this.state = {
            hasRouteAccess: true,
            routes
        };
    }

    public componentDidMount() {
        if (!this.state.hasRouteAccess) {
            this.redirectRoute(this.props)
        }
    }

    public componentDidUpdate() {
        if (!this.state.hasRouteAccess) {
          this.redirectRoute(this.props)
        }
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        return nextState.hasRouteAccess !== this.state.hasRouteAccess
    }

    public redirectRoute(props: IProps) {
        const { location, user, history } = props
        const { pathname, state } = location

        if (!user.userLoggedIn) {
          history.push({
            pathname: '/login',
            state: { redirectUrl: pathname },
          })
        } else {
            // const redirectUrl = state && state.redirectUrl ? state.redirectUrl : '/'

            history.push('/')
        }
    }

    public render() {
        return this.state.hasRouteAccess ? <React.Fragment>{this.props.children}</React.Fragment> : null
    }
}

const mapStateToProps = (state: AppTypes.ReducerState) => ({
    user: state.user
})

type IProps = ReturnType<typeof mapStateToProps> & RouteComponentProps

interface IState extends IAppContext{
    hasRouteAccess: boolean,
}

export default withRouter(connect(mapStateToProps)(Authorization))