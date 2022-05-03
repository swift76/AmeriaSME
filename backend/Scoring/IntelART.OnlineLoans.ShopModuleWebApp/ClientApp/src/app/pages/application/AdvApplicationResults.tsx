// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import AdvApplicationResultContainer, {
    IAdvAppResultProps
} from 'app/containers/pageContainers/AdvApplicationResultContainer';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import {
    IPreApprovedResultsGroupData,
    IPreApprovedResultsPostData
} from 'app/store/reducers/preapprovedResults/models';
import React, { useEffect, useState } from 'react';

import ApprovedResultTable from 'app/components/ApprovedResultTable';
import BackButton from 'app/components/BackButton';
import CancelModalContent from 'app/components/Modals/CancelModalContent';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import localization from 'app/locale/hy/global.json';
import { useCurrencyName } from 'app/hooks/getCurrencyName';

const Page: React.SFC<IAdvAppResultProps> = props => {
    const { match, preapprovedResults, application } = props;
    const { id } = match.params;
    const [results, setResults] = useState<IPreApprovedResultsGroupData[]>([]);
    const [disableForm, setDisableForm] = useState(false);

    useEffect(() => {
        const res = preapprovedResults.data;
        if (res.length) {
            const sorting = _.uniq(_.map(res, 'LOAN_TERM'));
            const groupedData = _(res)
                .groupBy('LOAN_TERM')
                .map((scorings, term) => ({ term, scorings }))
                .sort((a, b) => sorting.indexOf(Number(a.term)) - sorting.indexOf(Number(b.term)))
                .value();

            setResults(groupedData);
        }
    }, [preapprovedResults.data]);

    useEffect(() => {
        props.getApplication(id);
        props.getPreApprovedResults(id);
    }, [id]);

    useEffect(() => {
        return () => {
            props.resetPreApprovedResults();
            props.resetApplication();
        };
    }, []);

    const cancelApplication = () => {
        const { REFUSE_REASON } = localization.modalTxt.TITLE_TXT;
        props.openModal({
            children: <CancelModalContent id={id} />,
            title: REFUSE_REASON,
            footer: (
                <Button variant="primary" type="submit" form="cancelForm">
                    Հաստատել
                </Button>
            )
        });
    };

    const acceptScoring = async (data: IPreApprovedResultsPostData) => {
        setDisableForm(true);
        await props.savePreApprovedResult(id, data);
        props.openModal({
            children: 'Վարկը ուղարկված է ձևակերպման',
            title: 'Ուղարկված է ձևակերպման',
            loading: false,
            footer: '',
            onHideAction: () => {
                props.history.push('/');
            }
        });
    };

    const currencyName = useCurrencyName(
        application.data.CURRENCY_CODE,
        application.data.LOAN_TYPE_ID
    );

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
                                <h2>
                                    {`Հայտ #${application.data.ISN}`}
                                    <small className="text-success title-badge ml-2">
                                        (Հաստատված)
                                    </small>
                                </h2>
                                <Link
                                    to={{
                                        pathname: `/application/advance/${id}`,
                                        state: {
                                            from: `/application/advance/${id}/results`
                                        }
                                    }}
                                >
                                    Դիտել վարկային հայտը
                                </Link>
                            </div>
                        </Col>
                        <Col xs={true} className="text-right">
                            <Button
                                variant="danger"
                                className="mr-3 min-w-100"
                                onClick={cancelApplication}
                                disabled={false}
                            >
                                Մերժել
                            </Button>
                        </Col>
                    </Row>
                    <hr className="mt-1" />
                    <Row className="mt-5">
                        <Col xs={true} xl={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                            <fieldset disabled={disableForm}>
                                {preapprovedResults.resultsIsLoading ? (
                                    <div className="text-center">
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="mr-1"
                                            variant="primary"
                                        />
                                    </div>
                                ) : (
                                    results.map(result => (
                                        <div key={result.term} className="result-term">
                                            <h3 className="mb-3">
                                                <strong>{`Հաստատված առաջարկներ ${result.term} ամիս ժամկետով`}</strong>
                                            </h3>
                                            {result.scorings.map(scoring => (
                                                <ApprovedResultTable
                                                    key={scoring.ID}
                                                    applicationId={id}
                                                    acceptScoring={acceptScoring}
                                                    currency={currencyName}
                                                    {...scoring}
                                                />
                                            ))}
                                        </div>
                                    ))
                                )}
                            </fieldset>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

const AdvApplicationResult = AdvApplicationResultContainer(Page);

export default AdvApplicationResult;
