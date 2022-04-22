import * as AppTypes from 'AppTypes';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
    getApplication,
    getLoanSpecApplication,
    saveLoanSpecApplication
} from 'app/api/Application';
import {
    getBadMonthEarnings,
    getBalances,
    getGoodMonthEarnings,
    getGuarantors,
    getIndustryProducts,
    getIndustryTypes,
    getNonOpExpanses,
    getOpExpanses,
    getOtherStatistics,
    getOverHeads,
    getPledgers,
    getProfits
} from 'app/api/LoanAppGroupData';

import { ILoanSpecApplicationData } from 'app/store/reducers/loanSpecApplication/models';
import { IModalOptions } from 'app/store/reducers/settings/modals/models';
import React from 'react';
import { connect } from 'react-redux';
import { getCompanyPhotos } from 'app/api/CompanyPhotos';
import { modals } from 'app/store/reducers/settings/actions';
import { resetApplication } from 'app/store/reducers/application/actions';
import { resetLoanSpecApplication } from 'app/store/reducers/loanSpecApplication/actions';

export default (Page: React.FC<IAdvanceAppProps>) => {
    const AdvApplicationContainer = (props: IAdvanceAppProps) => <Page {...props} />;

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(AdvApplicationContainer));
};

const mapDispatchToProps = (dispatch: AppTypes.DispatchActions) => {
    return {
        getLoanSpecApplication: (id: string) => dispatch(getLoanSpecApplication(id)),
        saveLoanSpecApplication: (id: string, data: ILoanSpecApplicationData) =>
            dispatch(saveLoanSpecApplication(id, data)),
        resetLoanSpecApplication: () => dispatch(resetLoanSpecApplication()),
        getProfits: (id: string) => dispatch(getProfits(id)),

        getCompanyPhotos: (id: string) => dispatch(getCompanyPhotos(id)),
        getOverHeads: (id: string) => dispatch(getOverHeads(id)),
        getBalances: (id: string) => dispatch(getBalances(id)),
        getOpExpanses: (id: string) => dispatch(getOpExpanses(id)),
        getOtherStatistics: (id: string) => dispatch(getOtherStatistics(id)),
        getNonOpExpanses: (id: string) => dispatch(getNonOpExpanses(id)),
        getGuarantors: (id: string) => dispatch(getGuarantors(id)),
        getPledgers: (id: string) => dispatch(getPledgers(id)),
        getGoodMonthEarnings: (id: string) => dispatch(getGoodMonthEarnings(id)),
        getBadMonthEarnings: (id: string) => dispatch(getBadMonthEarnings(id)),
        getApplication: (id: string) => dispatch(getApplication(id)),
        openModal: (options: IModalOptions) => dispatch(modals.openModal(options)),
        getIndustryTypes: () => dispatch(getIndustryTypes()),
        getIndustryProducts: () => dispatch(getIndustryProducts())
    };
};

const mapStateToProps = (state: AppTypes.ReducerState) => ({
    status: state.application.data.STATUS_STATE,
    isn: state.application.data.ISN,
    loanSpecApplication: state.loanSpecApplication,
    loanParameters: state.loanParameters,
    loanAppGroupData: state.loanAppGroupData,
    loanLimits: state.loanLimits.data,
    documents: state.documents,
    pledgeCount: state.companyPhotos.pledgeCount,
    nonPledgeCount: state.companyPhotos.nonPledgeCount,
    fileMaxSize: state.loanSettings.fileMaxSize
});

interface MatchParams {
    id: string;
}

export type IAdvanceAppProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    RouteComponentProps<MatchParams>;
