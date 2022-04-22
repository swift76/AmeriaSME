import { Button, Col, Container, Row } from 'react-bootstrap';
import HomeContainer, { IHomeProps } from 'app/containers/pageContainers/HomeContainer';
import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IGetApplicationsParams } from 'app/store/reducers/applications/models';
import Loading from 'app/components/Loading';
import SearchForm from './components/SearchForm';
import TaxPayerTable from './components/TaxPayerTable';
import _ from 'lodash';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Page: React.FC<IHomeProps> = props => {
    const {
        applications,
        getApplications,
        resetApplications,
        loanSettings,
        setApplicationsParams,
        history
    } = props;
    const { settings } = loanSettings;
    const { taxIdNumber } = applications.params;
    const [submitForm, setSubmitForm] = useState(false);

    const onValidSubmit = async (values: IGetApplicationsParams) => {
        setSubmitForm(true);
        await getApplications(values);
        setApplicationsParams(values);
    };

    const goToApplication = () => {
        history.push('/application/short');
    };

    useEffect(() => {
        !!taxIdNumber && !submitForm && getApplications({ taxIdNumber });
    }, [taxIdNumber, submitForm]);

    useEffect(() => {
        return () => {
            resetApplications();
        };
    }, []);

    return (
        <div className="page-wrapper">
            <div className="page-content">
                <Container>
                    <Row>
                        <Col xs={true} className="text-right">
                            <Button
                                variant="primary"
                                onClick={goToApplication}
                                disabled={!Boolean(taxIdNumber)}
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                Նոր Հայտ
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={true} xl={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                            <h2>Փնտրել հայտը</h2>
                            <SearchForm onValidSubmit={onValidSubmit} taxIdNumber={taxIdNumber} />
                            <Row>
                                <Col lg="11">
                                    {applications.applocationsIsLoading ? (
                                        <Loading />
                                    ) : (
                                        applications.applocationsLoaded && (
                                            <TaxPayerTable
                                                data={applications.data}
                                                expireDayCount={settings.LS_EXPIRE_DAY_COUNT}
                                            />
                                        )
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

const HomePage = HomeContainer(React.memo(Page));

export default HomePage;
