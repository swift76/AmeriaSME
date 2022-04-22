import * as AppTypes from 'AppTypes';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
    getRefinansingLoan,
    postRefinansingLoan,
    getPreApprovedResults,
    savePreApprovedResult,
    getApplication
} from 'app/api/Application';

import { IModalOptions } from 'app/store/reducers/settings/modals/models';
import React from 'react';
import { connect } from 'react-redux';
import { modals } from 'app/store/reducers/settings/actions';
import { IPreApprovedResultsPostData } from 'app/store/reducers/preapprovedResults/models';
import { resetPreApprovedResults } from 'app/store/reducers/preapprovedResults/actions';
import { resetApplication } from 'app/store/reducers/application/actions';

export default (Page: React.FC<IAdvAppResultProps>) => {
    const AdvApplicationResultContainer = (props: IAdvAppResultProps) => <Page {...props} />;

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(AdvApplicationResultContainer));
};

const mapDispatchToProps = (dispatch: AppTypes.DispatchActions) => {
    return {
        getRefinansingLoan,
        postRefinansingLoan,
        openModal: (options: IModalOptions) => dispatch(modals.openModal(options)),
        closeModal: () => dispatch(modals.closeModal()),
        getApplication: (id: string) => dispatch(getApplication(id)),
        resetApplication: () => dispatch(resetApplication()),
        setModalOptions: (options: IModalOptions) => dispatch(modals.setModalOptions(options)),
        resetPreApprovedResults: () => dispatch(resetPreApprovedResults()),
        getPreApprovedResults: (id: string) => dispatch(getPreApprovedResults(id)),
        savePreApprovedResult: (id: string, data: IPreApprovedResultsPostData) =>
            dispatch(savePreApprovedResult(id, data))
    };
};

const mapStateToProps = (state: AppTypes.ReducerState) => ({
    preapprovedResults: state.preapprovedResults,
    application: state.application
});

interface MatchParams {
    id: string;
}

export type IAdvAppResultProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    RouteComponentProps<MatchParams>;
