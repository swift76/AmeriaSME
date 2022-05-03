import { Col, Container, Row } from 'react-bootstrap';
import ProfileContainer, { IProfileProps } from 'app/containers/pageContainers/ProfileContainer';

import BackButton from 'app/components/BackButton';
import ChangePasswordForm from './components/ChangePasswordForm';
import { IChangePasswordDataSend } from 'app/store/reducers/user/models';
import JwtService from 'app/services/jwtService';
import React from 'react';

const Page: React.FC<IProfileProps> = (props: IProfileProps) => {
    const { changePassword, history } = props;

    const onSubmmit = (values: IChangePasswordDataSend) => {
        const decodedToken = JwtService.decodeAccessToken();
        changePassword({
            ...values,
            UserName: decodedToken.name,
            ReturnUrl: '/'
        }).then(() => {
            history.push('/');
        });
    };

    return (
        <div className="page-wrapper">
            <div className="page-content">
                <Container>
                    <Row>
                        <Col xs={true} lg={{ offset: 1, span: 10 }} className="mb-3">
                            <BackButton back={'/'} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={true} lg={{ offset: 1, span: 10 }}>
                            <h2 className="mb-4">Գաղտնաբառի փոփոխում</h2>
                            <ChangePasswordForm onValidSubmit={onSubmmit} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

const ProfilePage = ProfileContainer(Page);

export default ProfilePage;
