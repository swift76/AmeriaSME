import * as AppTypes from 'AppTypes';

import { RouteComponentProps, withRouter } from 'react-router-dom';

import React from 'react';
import { cancelApplicaton } from 'app/api/Application';
import { connect } from 'react-redux';
import { getCancelReasons } from 'app/api/Directory';
import { modals } from 'app/store/reducers/settings/actions';

export default (Component: React.FC<ICancelModalProps>) => {
    const CancelModalContainer = (props: ICancelModalProps) => <Component {...props} />;

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(CancelModalContainer));
};

const mapDispatchToProps = (dispatch: AppTypes.DispatchActions) => {
    return {
        getCancelReasons: () => dispatch(getCancelReasons()),
        closeModal: () => dispatch(modals.closeModal()),
        cancelApplicaton
    };
};

const mapStateToProps = (state: AppTypes.ReducerState) => ({
    cancelReasons: state.directory.cancelReasons
});

export type ICancelModalProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> & { id: string } & RouteComponentProps;
