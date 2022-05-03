// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import HeaderContainer, { IHeaderProps } from 'app/containers/componentContainers/HeaderContainer';
import { Nav, Navbar } from 'react-bootstrap';
import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Component: React.FC<IHeaderProps> = props => {
    const { user, userLogout, getUserInfo } = props;
    const handleLogout = (e: React.SyntheticEvent<any>): void => {
        userLogout();
    };

    useEffect(() => {
        !user.userInfoLoaded && getUserInfo();
    }, []);

    const { userInfo } = props.user;

    return (
        <Navbar collapseOnSelect={true} expand="lg" fixed="top" bg="white" className="page-navbar">
            <Navbar.Brand as={Link} to="/">
                <img
                    src="/assets/images/logos/logo.png"
                    alt="Ameria Bank"
                    className="logo"
                    width="210"
                    height="30"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link as={Link} to="/profile">
                        {userInfo && `${userInfo.FIRST_NAME_AM} ${userInfo.LAST_NAME_AM}`}
                        <FontAwesomeIcon icon={faUser} className="ml-1" />
                    </Nav.Link>
                    <Nav.Link onClick={handleLogout}>Ելք</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

const Header = HeaderContainer(React.memo(Component));

export default Header;
