// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
    ADDITIONAL_ATTACHMENTS_NEEDED,
    CANCELLED,
    LOAN_SPECIALIST_ELIGIBLE,
    PRE_APPROVAL_REVIEW_ADDITIONAL_DATA,
    PRE_APPROVAL_SUBMITTED
} from 'app/constants/application';
import AdvApplicationContainer, {
    IAdvanceAppProps
} from 'app/containers/pageContainers/AdvApplicationContainer';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';

import { ActionButtons } from './components/advanceApplication/ActionButtons';
import AppCompanyData from 'app/components/CompanyData';
import AppRelatedPersons from 'app/components/RelatedPersons';
import BackButton from 'app/components/BackButton';
import CancelModalContent from 'app/components/Modals/CancelModalContent';
import CompanyPhotos from 'app/components/CompanyPhotos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
import { ILoanSpecApplicationData } from 'app/store/reducers/loanSpecApplication/models';
import { Link } from 'react-router-dom';
import LoanNavbar from './components/advanceApplication/Navbar';
import LoanSpecBase from './components/advanceApplication/LoanSpecBaseFields';
import OverHeads from 'app/components/OverHeads';
import Pledge from 'app/components/Pledge';
import { Utils } from 'app/services/utils';
import _ from 'lodash';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { getValidationScheme } from './components/advanceApplication/helpers/validation';
import localization from 'app/locale/hy/global.json';
import { updateCompanyData } from './components/advanceApplication/helpers/mapData';
import { useMonitoring } from 'app/hooks/monitoring';

const Page: React.FC<IAdvanceAppProps> = props => {
    const {
        match,
        getLoanSpecApplication,
        loanSpecApplication,
        saveLoanSpecApplication,
        loanParameters,
        getProfits,
        getOverHeads,
        getGuarantors,
        getIndustryTypes,
        getIndustryProducts,
        getBalances,
        getPledgers,
        getOpExpanses,
        getNonOpExpanses,
        getOtherStatistics,
        getCompanyPhotos,
        loanAppGroupData,
        resetLoanSpecApplication,
        getGoodMonthEarnings,
        getBadMonthEarnings,
        documents,
        getApplication,
        openModal,
        status,
        isn,
        loanLimits,
        pledgeCount,
        nonPledgeCount,
        fileMaxSize
    } = props;
    const { id } = match.params;
    const [pledgeIsShow, setPledgeIsShow] = useState(false);
    const advForm = useRef<any>(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formIsDisabled, setFormIsDisabled] = useState(false);
    const {
        profits,
        opExpenses,
        nonOpExpenses,
        balances,
        otherStatistics,
        guarantors,
        goodMonthEarnings,
        badMonthEarnings,
        overheads,
        pledgers,
        industryTypes,
        industryProducts
    } = loanAppGroupData;
    const parameters = loanParameters.data;

    useEffect(() => {
        getApplication(id);
        getLoanSpecApplication(id);

        !industryTypes.industryIsLoaded && getIndustryTypes();
        !industryProducts.industryIsLoaded && getIndustryProducts();

        getProfits(id);
        getOverHeads(id);
        getOpExpanses(id);
        getNonOpExpanses(id);
        getBalances(id);
        getGoodMonthEarnings(id);
        getBadMonthEarnings(id);
        getOtherStatistics(id);
        getGuarantors(id);
        getCompanyPhotos(id);
    }, [id]);

    useEffect(() => {
        pledgeIsShow && !pledgers.isLoaded && getPledgers(id);
    }, [pledgeIsShow]);

    useEffect(() => {
        if (status) {
            setFormIsDisabled(
                status !== LOAN_SPECIALIST_ELIGIBLE &&
                    status !== PRE_APPROVAL_REVIEW_ADDITIONAL_DATA &&
                    status !== CANCELLED &&
                    status !== PRE_APPROVAL_SUBMITTED &&
                    status !== ADDITIONAL_ATTACHMENTS_NEEDED
            );
        }
    }, [status]);

    useEffect(() => {
        return () => {
            resetLoanSpecApplication();
        };
    }, []);

    const cancelApplication = () => {
        const { REFUSE_REASON } = localization.modalTxt.TITLE_TXT;
        openModal({
            children: <CancelModalContent id={id} />,
            title: REFUSE_REASON,
            footer: (
                <Button variant="primary" type="submit" form="cancelForm">
                    Հաստատել
                </Button>
            )
        });
    };

    const onValidSubmit = async (values: ILoanSpecApplicationData) => {
        values.IS_SUBMIT = true;
        if (Utils.checkPhotosIsUploaded(pledgeIsShow, pledgeCount, nonPledgeCount)) {
            try {
                await saveLoanSpecApplication(id, values);
                setSubmitLoading(false);
                getApplication(id);
            } catch (error) {
                setSubmitLoading(false);
            }
        }
    };

    const handleFormSave = async (e: React.SyntheticEvent<any>) => {
        const { values } = advForm.current.state;
        values.IS_SUBMIT = false;
        setSaveLoading(true);
        try {
            await saveLoanSpecApplication(id, values);
            setSaveLoading(false);
        } catch (error) {
            setSaveLoading(false);
        }
    };

    const getInitialValues = () => {
        return {
            ...loanSpecApplication.data,
            PROFITS: updateCompanyData(profits.data),
            OPERATIONAL_EXPENSES: updateCompanyData(opExpenses.data),
            NONOPERATIONAL_EXPENSES: updateCompanyData(nonOpExpenses.data),
            BALANCES: updateCompanyData(balances.data),
            OTHER_STATISTICS: updateCompanyData(otherStatistics.data),
            GUARANTORS: guarantors.data,
            GOOD_MONTH_EARNINGS: updateCompanyData(goodMonthEarnings.data),
            BAD_MONTH_EARNINGS: updateCompanyData(badMonthEarnings.data),
            PLEDGERS: pledgers.data,
            OVERHEADS: overheads.data,
            C01: Utils.checkDocumentIsUploaded('C01', documents),
            A01: Utils.checkDocumentIsUploaded('A01', documents)
        };
    };

    useMonitoring(id, 3);

    return (
        <div className="page-wrapper">
            <div className="page-content">
                <Container>
                    <Row>
                        <Col xs={true} className="mb-3">
                            <BackButton />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={true}>
                            <div className="loan-title">
                                <h2>{`Վարկային հայտ #${isn}`}</h2>
                                <Link
                                    to={{
                                        pathname: `/application/short/${id}`,
                                        state: {
                                            from: `/application/advance/${id}`
                                        }
                                    }}
                                >
                                    Դիտել պարզեցված հայտը
                                </Link>
                            </div>
                        </Col>
                        <Col xs={true} className="text-right">
                            <ActionButtons
                                handleFormSave={handleFormSave}
                                saveLoading={saveLoading}
                                submitLoading={submitLoading}
                                cancelAction={cancelApplication}
                                disabled={formIsDisabled}
                            />
                        </Col>
                    </Row>
                    <hr className="mt-1" />
                    <Row className="sticky-top bg-white mb-3">
                        <Col>
                            <LoanNavbar pledgers={pledgeIsShow} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Formik
                                initialValues={{ ...getInitialValues(), ID: id }}
                                onSubmit={onValidSubmit}
                                enableReinitialize={true}
                                validationSchema={getValidationScheme(
                                    parameters.REPAYMENT_DAY_FROM,
                                    parameters.REPAYMENT_DAY_TO,
                                    pledgeIsShow,
                                    loanLimits
                                )}
                                ref={advForm}
                            >
                                {formikProps => (
                                    <Form
                                        className="loan-form"
                                        noValidate={true}
                                        onSubmit={formikProps.handleSubmit}
                                        id="advApplicationForm"
                                    >
                                        <fieldset disabled={formIsDisabled}>
                                            <LoanSpecBase
                                                {...formikProps}
                                                setPledgeIsShow={setPledgeIsShow}
                                                id={id}
                                            />
                                            <Row>
                                                <Col
                                                    md={{ span: 12 }}
                                                    lg={{ span: 8, offset: 2 }}
                                                    xl={{ span: 8, offset: 2 }}
                                                >
                                                    <p className="mt-3 mb-4">
                                                        <FontAwesomeIcon
                                                            icon={faInfoCircle}
                                                            className="mr-1 text-primary"
                                                        />
                                                        Բոլոր տվյալները անհրաժեշտ է լրացնել միջին
                                                        ամսական կտրվածքով:
                                                    </p>

                                                    <AppCompanyData
                                                        dataName="PROFITS"
                                                        editable={true}
                                                        showTotal={true}
                                                        sectionName="companyProfits"
                                                        title="հասույթ"
                                                        maxRowCount={6}
                                                        loading={profits.isLoading}
                                                        sync={[
                                                            'GOOD_MONTH_EARNINGS',
                                                            'BAD_MONTH_EARNINGS'
                                                        ]}
                                                        {...formikProps}
                                                    />

                                                    <OverHeads
                                                        loading={overheads.isLoading}
                                                        {...formikProps}
                                                    />

                                                    <AppCompanyData
                                                        dataName="OPERATIONAL_EXPENSES"
                                                        sectionName="companyExpenses"
                                                        title="Գործառնական ծախսեր"
                                                        showTotal={true}
                                                        loading={opExpenses.isLoading}
                                                        {...formikProps}
                                                    />

                                                    <AppCompanyData
                                                        dataName="NONOPERATIONAL_EXPENSES"
                                                        sectionName="companyExpenses1"
                                                        title="Ոչ գործառնական ծախսեր"
                                                        showTotal={true}
                                                        loading={nonOpExpenses.isLoading}
                                                        {...formikProps}
                                                    />

                                                    <AppCompanyData
                                                        dataName="BALANCES"
                                                        sectionName="companyBalances"
                                                        title="Հաշվեկշռի տվյալներ (վերլուծության ամսաթվի դրությամբ)"
                                                        showTotal={true}
                                                        loading={balances.isLoading}
                                                        {...formikProps}
                                                    />

                                                    <AppCompanyData
                                                        dataName="GOOD_MONTH_EARNINGS"
                                                        sectionName="companyBalancesGood"
                                                        editable={false}
                                                        title="Լավ ամսվա հասույթ"
                                                        showTotal={true}
                                                        loading={goodMonthEarnings.isLoading}
                                                        {...formikProps}
                                                    />

                                                    <AppCompanyData
                                                        dataName="BAD_MONTH_EARNINGS"
                                                        sectionName="companyBalancesBad"
                                                        editable={false}
                                                        title="վատ ամսվա հասույթ"
                                                        showTotal={true}
                                                        loading={badMonthEarnings.isLoading}
                                                        {...formikProps}
                                                    />

                                                    <AppCompanyData
                                                        dataName="OTHER_STATISTICS"
                                                        sectionName="companyOtherStatistics"
                                                        title="Այլ"
                                                        showTotal={false}
                                                        loading={otherStatistics.isLoading}
                                                        {...formikProps}
                                                    >
                                                        {[
                                                            {
                                                                name: 'Տարածքը վարձակալված Է',
                                                                fileName: 'IS_AREA_RENTED',
                                                                noteFieldName:
                                                                    'AREA_RENTED_COMMENT',
                                                                radio: true
                                                            }
                                                        ]}
                                                    </AppCompanyData>

                                                    <div
                                                        className={`adv-loan-section`}
                                                        id="companyOtherStatistics"
                                                    >
                                                        <h5 className="adv-loan-title">
                                                            Երաշխավորություն
                                                        </h5>
                                                        <Table
                                                            striped={true}
                                                            borderless={true}
                                                            className="adv-loan-table"
                                                        >
                                                            <AppRelatedPersons
                                                                title="Երաշխավորություն"
                                                                rowName="Երաշխավոր"
                                                                dataName="GUARANTORS"
                                                                loading={guarantors.isLoading}
                                                                {...formikProps}
                                                            />
                                                        </Table>
                                                    </div>

                                                    {/* <CompanyPhotos {...formikProps} id={id} /> */}

                                                    <div
                                                        id="companyPhotos"
                                                        className="adv-loan-section"
                                                    >
                                                        <h5 className="adv-loan-title">
                                                            {pledgeIsShow
                                                                ? `Բիզնեսի և գրավի լուսանկարներ`
                                                                : `Բիզնեսի լուսանկարներ`}
                                                        </h5>

                                                        <CompanyPhotos
                                                            id={id}
                                                            pledge={false}
                                                            fileMaxSize={fileMaxSize}
                                                        ></CompanyPhotos>
                                                        {pledgeIsShow && (
                                                            <CompanyPhotos
                                                                id={id}
                                                                pledge={true}
                                                                fileMaxSize={fileMaxSize}
                                                            ></CompanyPhotos>
                                                        )}
                                                    </div>

                                                    {pledgeIsShow && (
                                                        <Pledge {...formikProps} id={id} />
                                                    )}

                                                    <div className={`adv-loan-section`}>
                                                        <h5 className="adv-loan-title">
                                                            Գործունեության նկարագրություն
                                                        </h5>
                                                        <Form.Group
                                                            controlId="ACTIVITY_DESCRIPTION"
                                                            as={Row}
                                                            className="p-0"
                                                        >
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={3}
                                                                value={
                                                                    formikProps.values
                                                                        .ACTIVITY_DESCRIPTION || ''
                                                                }
                                                                onChange={formikProps.handleChange}
                                                                isValid={
                                                                    formikProps.touched
                                                                        .ACTIVITY_DESCRIPTION &&
                                                                    !formikProps.errors
                                                                        .ACTIVITY_DESCRIPTION
                                                                }
                                                                isInvalid={
                                                                    formikProps.touched
                                                                        .ACTIVITY_DESCRIPTION &&
                                                                    !!formikProps.errors
                                                                        .ACTIVITY_DESCRIPTION
                                                                }
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </fieldset>
                                    </Form>
                                )}
                            </Formik>
                        </Col>
                    </Row>
                    <hr className="mt-3 mb-3" />
                    <Row>
                        <Col xs={true} className="text-right mb-5">
                            <ActionButtons
                                handleFormSave={handleFormSave}
                                saveLoading={saveLoading}
                                submitLoading={submitLoading}
                                cancelAction={cancelApplication}
                                disabled={formIsDisabled}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

const AdvanceApplication = AdvApplicationContainer(Page);

export default AdvanceApplication;
