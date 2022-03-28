import { Button, Nav, Navbar, Spinner } from 'react-bootstrap'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { NavHashLink as NavLink } from 'react-router-hash-link'
import React from 'react'

export interface ILoanNavbarProps extends RouteComponentProps {
  submitLoading?: boolean;
  saveLoading?: boolean;
  disabled?: boolean;
  pledgers?: boolean;
}

const LoanNavbar: React.FC<ILoanNavbarProps> = props => {
  const { pledgers, location } = props

  const scroll = (el: HTMLElement) => {
    window.scrollTo({
      top: el.offsetTop + (window.innerHeight - 150),
      behavior: 'smooth',
    })
  }


  const isActive = (match: any, loc: any) => {
    console.log(match)
    return loc.hash === location.hash
  }

  return (
    <Nav className="adv-loan-navbar" variant="pills">
      <Nav.Link
        as={NavLink}
        scroll={scroll}
        exact={true}
        strict={true}
        isActive={() => location.hash === `#companyProfits` }
        to={`#companyProfits`}
      >
        Հասույթ
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        scroll={scroll}
        exact={true}
        strict={true}
        isActive={() => location.hash === `#companyOverheads` }
        to={`#companyOverheads`}
      >
        Վերադիր
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        scroll={scroll}
        exact={true}
        strict={true}
        isActive={() => location.hash === `#companyExpenses` }
        to={`#companyExpenses`}
      >
        Ծախսեր
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        scroll={scroll}
        exact={true}
        strict={true}
        isActive={() => location.hash === `#companyBalances` }
        to={`#companyBalances`}
      >
        Հաշվեկշիռ
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        scroll={scroll}
        exact={true}
        strict={true}
        isActive={() => location.hash === `#companyOtherStatistics` }
        to={`#companyOtherStatistics`}
      >
        Հավելյալ
      </Nav.Link>
      {pledgers && (
        <Nav.Link
          as={NavLink}
          scroll={scroll}
          exact={true}
          strict={true}
          isActive={() => location.hash === `#applicationPledgers` }
          to={`#applicationPledgers`}
        >
          Գրավ
        </Nav.Link>
      )}
    </Nav>
  )
}

export default withRouter(LoanNavbar)
