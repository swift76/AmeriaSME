import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import {
    IGetMainApplicationData,
    IRefinancingLoansData
} from 'app/store/reducers/mainApplication/models';
import { LOAN_SPECIALIST_ELIGIBLE, PRE_APPROVAL_SUCCESS } from 'app/constants/application';
import MainApplicationContainer, {
    IMainAppProps
} from 'app/containers/pageContainers/MainApplicationContainer';
import React, { useEffect, useRef, useState } from 'react';

import { ActionButtons } from './components/mainApplication/ActionButtons';
import BackButton from 'app/components/BackButton';
import CancelModalContent from 'app/components/Modals/CancelModalContent';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import RefinancingTable from 'app/components/RefinancingTable/index';
import { Utils } from 'app/services/utils';
import _ from 'lodash';
import { getValidationScheme } from './components/mainApplication/helper';
import { initialScoringResult } from 'app/store/reducers/scoringResults/initialState';
import localization from 'app/locale/hy/global.json';
import { useCurrencyName } from 'app/hooks/getCurrencyName';

const Page: React.FC<IMainAppProps> = React.memo(props => {
    const {
        match,
        history,
        getScoringResults,
        getApplication,
        scoringResults,
        saveMainApplication,
        getMainApplication,
        application,
        openModal,
        closeModal,
        mainApplication,
        currencies,
        resetMainApplication,
        resetScoringResults,
        refuseApplication,
        getRefinansingLoan,
        postRefinansingLoan,
        getLoanParameters,
        loanParameters,
        resetApplication
    } = props;
    const { id } = match.params;
    const form = useRef<any>(null);
    const refinancingForm = useRef<any>(null);
    const [scoringResult, setScoringResult] = useState({
        ...initialScoringResult
    });
    const [mainFormDisabled, setMainForDisabled] = useState(false);
    const [isRefinancing, setIsRefinancing] = useState(false);
    const [refinansingLoading, setrefinansingLoading] = useState(false);
    const [mainFormSubmitLoading, setMainFormSubmitLoading] = useState(false);
    const [refinansingLoans, setRefinansingLoans] = useState<IRefinancingLoansData[]>([]);
    const { formatAsCurrency } = Utils;
    const { TITLE_TXT, CONTENT_TXT } = localization.modalTxt;

    const onValidSubmit = async (values: IGetMainApplicationData) => {
        const canMainFormSubmit = await checkRefInansingValidity();

        if (canMainFormSubmit) {
            setMainFormSubmitLoading(true);
            values.IS_SUBMIT = true;
            if (loanParameters.data.IS_OVERDRAFT) {
                values.OVERDRAFT_TEMPLATE_CODE = scoringResult.TEMPLATE_CODE;
            } else {
                values.LOAN_TEMPLATE_CODE = scoringResult.TEMPLATE_CODE;
            }

            const data = await saveMainApplication(id, values);
            isRefinancing && (await refinancingSubmit());
            setMainForDisabled(true);
            setMainFormSubmitLoading(false);
            openModal({
                children: data.IDENTIFICATION_REASON || CONTENT_TXT.COME_TO_BRANCH,
                title: TITLE_TXT.COME_TO_BRANCH,
                loading: false,
                footer: '',
                onHideAction: () => {
                    history.push('/');
                }
            });
        }
    };

    const checkRefInansingValidity = async () => {
        const refForm = refinancingForm.current;
        if (!refForm) {
            return Promise.resolve(true);
        }
        refForm.handleSubmit();
        const errors = await refForm.validateForm();
        return Promise.resolve(!errors.loans);
    };

    const refinancingSubmit = () => {
        const refForm = refinancingForm.current;
        if (!refForm) {
            return Promise.resolve(true);
        }
        const { values } = refForm.state;
        const data = values.loans;
        return postRefinansingLoan(id, data);
    };

    const cancelApplication = () => {
        openModal({
            children: <CancelModalContent id={id} />,
            title: TITLE_TXT.REFUSE_REASON,
            footer: (
                <Button variant="primary" type="submit" form="cancelForm">
                    Հաստատել
                </Button>
            )
        });
    };

    useEffect(() => {
        getApplication(id);
        getMainApplication(id).then(data => {
            getLoanParameters(data.LOAN_TYPE_ID);
        });
        getScoringResults(id);
        return () => {
            resetMainApplication();
            resetScoringResults();
        };
    }, []);

    useEffect(() => {
        return () => {
            resetApplication();
        };
    }, []);

    const currencyName = useCurrencyName(
        mainApplication.data.CURRENCY_CODE,
        mainApplication.data.LOAN_TYPE_ID
    );

    useEffect(() => {
        const result = scoringResults.data[0];
        result && setScoringResult(result);
    }, [scoringResults.data]);

    useEffect(() => {
        if (isRefinancing) {
            setrefinansingLoading(true);
            getRefinansingLoan(id)
                .then(data => {
                    setRefinansingLoans(data);
                })
                .finally(() => {
                    setrefinansingLoading(false);
                });
        }
    }, [isRefinancing]);

    const getInitialFinalAmount = () => {
        const { FINAL_AMOUNT } = mainApplication.data;
        const { APPROVED_AMOUNT_1, APPROVED_AMOUNT_2 } = scoringResult;
        return (
            (!!FINAL_AMOUNT && FINAL_AMOUNT) ||
            (!APPROVED_AMOUNT_1 && APPROVED_AMOUNT_2) ||
            (!APPROVED_AMOUNT_2 && APPROVED_AMOUNT_1) ||
            FINAL_AMOUNT
        );
    };

    useEffect(() => {
        const { STATUS_STATE } = mainApplication.data;
        const { APPROVED_AMOUNT_2 } = scoringResult;
        setMainForDisabled(!(STATUS_STATE === PRE_APPROVAL_SUCCESS));
        if (!!form.current) {
            const { setFieldValue } = form.current;
            const finalAmount = getInitialFinalAmount();
            setIsRefinancing(finalAmount === APPROVED_AMOUNT_2);
            setFieldValue('ID', id);
            setFieldValue('IS_REFINANCING', finalAmount === APPROVED_AMOUNT_2);
            setFieldValue('LOAN_TERM', scoringResult.TERM_TO);
            setFieldValue('INTEREST', scoringResult.INTEREST);
            setFieldValue('FINAL_AMOUNT', finalAmount);
        }
    }, [scoringResult, mainApplication.data]);

    const handleChangeAmount = (refinancing: boolean) => (e: React.SyntheticEvent<any>) => {
        setIsRefinancing(refinancing);
        if (form && form.current) {
            const { setFieldValue } = form.current;
            setFieldValue(
                'FINAL_AMOUNT',
                refinancing ? scoringResult.APPROVED_AMOUNT_2 : scoringResult.APPROVED_AMOUNT_1
            );
            setFieldValue('IS_REFINANCING', refinancing);
        }
    };

    const refuseConditions = async () => {
        try {
            await refuseApplication(id);
            try {
                const data = await getApplication(id);
                closeModal();
                data.STATUS_STATE === LOAN_SPECIALIST_ELIGIBLE &&
                    history.push(`/application/advance/${id}`);
            } catch (error) {
                history.push(`/`);
            }
        } catch (error) {
            closeModal();
            history.push(`/`);
        }
    };

    const openRefuseModal = async () => {
        openModal({
            children: CONTENT_TXT.CONFIRM_REFUSE,
            title: TITLE_TXT.PLEASE_CONFIRM,
            footer: (
                <Button variant="primary" onClick={refuseConditions}>
                    Հաստատել
                </Button>
            )
        });
    };

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
                        <Col xs="12" xl="6" sm="12">
                            <div className="loan-title">
                                <h2>
                                    {`Հայտ #${application.data.ISN}`}
                                    <Link
                                        to={{
                                            pathname: `/application/short/${id}`,
                                            state: {
                                                from: `/application/main/${id}`
                                            }
                                        }}
                                    >
                                        Դիտել վարկային հայտը
                                    </Link>
                                </h2>
                                <span className="text-success title-badge">Հաստատված</span>
                            </div>
                        </Col>
                        <Col xs="12" xl="6" sm="12" className="text-right">
                            <ActionButtons
                                cancelApplication={cancelApplication}
                                refuseConditions={openRefuseModal}
                                submitLoading={mainFormSubmitLoading}
                                disabled={mainFormDisabled}
                            />
                        </Col>
                    </Row>
                    <hr className="mt-1" />
                    <Formik
                        initialValues={mainApplication.data}
                        onSubmit={onValidSubmit}
                        enableReinitialize={true}
                        ref={form}
                        validationSchema={getValidationScheme(
                            loanParameters.data.REPAYMENT_DAY_FROM,
                            loanParameters.data.REPAYMENT_DAY_TO
                        )}
                    >
                        {({ values, errors, touched, handleChange, handleSubmit }) => (
                            <Form
                                className="loan-form"
                                noValidate={true}
                                onSubmit={handleSubmit}
                                id="mainApplicationForm"
                            >
                                <Row>
                                    <Col
                                        md={{ span: 12 }}
                                        lg={{ span: 8, offset: 2 }}
                                        xl={{ span: 6, offset: 3 }}
                                    >
                                        <fieldset
                                            className="loan-form-group"
                                            disabled={mainFormDisabled}
                                        >
                                            {!!scoringResult.APPROVED_AMOUNT_1 && (
                                                <Form.Group controlId="APPROVED_AMOUNT_1" as={Row}>
                                                    <Form.Label column={true} sm={5}>
                                                        Հաստատված վարկի գումար
                                                    </Form.Label>
                                                    <Form.Check
                                                        required={true}
                                                        inline={true}
                                                        type="radio"
                                                        label={
                                                            formatAsCurrency(
                                                                scoringResult.APPROVED_AMOUNT_1
                                                            ) || ''
                                                        }
                                                        name="FINAL_AMOUNT"
                                                        value={scoringResult.APPROVED_AMOUNT_1}
                                                        onChange={handleChangeAmount(false)}
                                                        className="loan-form-checkbox"
                                                        checked={
                                                            values.FINAL_AMOUNT ===
                                                            scoringResult.APPROVED_AMOUNT_1
                                                        }
                                                        isInvalid={
                                                            touched.FINAL_AMOUNT &&
                                                            !!errors.FINAL_AMOUNT
                                                        }
                                                    />
                                                </Form.Group>
                                            )}
                                            {!!scoringResult.APPROVED_AMOUNT_2 && (
                                                <Form.Group controlId="APPROVED_AMOUNT_2" as={Row}>
                                                    <Form.Label column={true} sm={5}>
                                                        Հաստատված վարկի գումար վերաֆինանսավորմամբ
                                                    </Form.Label>
                                                    <Form.Check
                                                        required={true}
                                                        inline={true}
                                                        type="radio"
                                                        label={
                                                            formatAsCurrency(
                                                                scoringResult.APPROVED_AMOUNT_2
                                                            ) || ''
                                                        }
                                                        name="FINAL_AMOUNT"
                                                        value={scoringResult.APPROVED_AMOUNT_2}
                                                        onChange={handleChangeAmount(true)}
                                                        className="loan-form-checkbox"
                                                        checked={
                                                            values.FINAL_AMOUNT ===
                                                            scoringResult.APPROVED_AMOUNT_2
                                                        }
                                                        isInvalid={
                                                            touched.FINAL_AMOUNT &&
                                                            !!errors.FINAL_AMOUNT
                                                        }
                                                    />
                                                </Form.Group>
                                            )}
                                            <Form.Group controlId="INTEREST" as={Row}>
                                                <Form.Label column={true} sm={5}>
                                                    Տարեկան տոկոսադրույք
                                                </Form.Label>
                                                <Col sm={7}>
                                                    {scoringResults.scoringIsLoading ? (
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            className="mr-1"
                                                            variant="primary"
                                                        />
                                                    ) : (
                                                        <Form.Control
                                                            plaintext={true}
                                                            readOnly={true}
                                                            type="text"
                                                            name="INTEREST"
                                                            value={
                                                                scoringResult.INTEREST
                                                                    ? `${scoringResult.INTEREST}%`
                                                                    : ''
                                                            }
                                                        />
                                                    )}
                                                </Col>
                                            </Form.Group>
                                            <Form.Group controlId="LOAN_TERM" as={Row}>
                                                <Form.Label column={true} sm={5}>
                                                    Վարկի Ժամկետ
                                                </Form.Label>
                                                <Col sm={7}>
                                                    {scoringResults.scoringIsLoading ? (
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            className="mr-1"
                                                            variant="primary"
                                                        />
                                                    ) : (
                                                        <Form.Control
                                                            plaintext={true}
                                                            readOnly={true}
                                                            type="text"
                                                            name="LOAN_TERM"
                                                            value={
                                                                scoringResult.TERM_TO
                                                                    ? `${scoringResult.TERM_TO ||
                                                                          ''} ամիս`
                                                                    : ''
                                                            }
                                                        />
                                                    )}
                                                </Col>
                                            </Form.Group>
                                            <Form.Group controlId="CURRENCY_CODE" as={Row}>
                                                <Form.Label column={true} sm={5}>
                                                    Արժույթ
                                                </Form.Label>
                                                <Col sm={7}>
                                                    {currencies.currenciesIsLoading ? (
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            className="mr-1"
                                                            variant="primary"
                                                        />
                                                    ) : (
                                                        <Form.Control
                                                            plaintext={true}
                                                            readOnly={true}
                                                            defaultValue={currencyName}
                                                            type="text"
                                                            name="CURRENCY_CODE"
                                                        />
                                                    )}
                                                </Col>
                                            </Form.Group>
                                            <Form.Group controlId="REPAYMENT_DAY" as={Row}>
                                                <Form.Label column={true} sm={5}>
                                                    Վարկի վճարման նախընտրելի օր
                                                </Form.Label>
                                                <Col sm={7}>
                                                    <Form.Control
                                                        type="number"
                                                        name="REPAYMENT_DAY"
                                                        onChange={handleChange}
                                                        value={String(values.REPAYMENT_DAY)}
                                                        isValid={
                                                            touched.REPAYMENT_DAY &&
                                                            !errors.REPAYMENT_DAY
                                                        }
                                                        isInvalid={
                                                            touched.REPAYMENT_DAY &&
                                                            !!errors.REPAYMENT_DAY
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.REPAYMENT_DAY}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </fieldset>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                    {isRefinancing && (
                        <Row className="mt-5">
                            <Col sm={{ span: 8, offset: 2 }}>
                                {refinansingLoading ? (
                                    <p className="text-center">
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="mr-1"
                                            variant="primary"
                                        />
                                    </p>
                                ) : (
                                    <RefinancingTable
                                        data={refinansingLoans}
                                        innerRef={refinancingForm}
                                        disabled={mainFormDisabled}
                                    />
                                )}
                            </Col>
                        </Row>
                    )}
                </Container>
            </div>
        </div>
    );
});

const MainApplication = MainApplicationContainer(Page);

export default MainApplication;
