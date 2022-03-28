import {
  ADDITIONAL_ATTACHMENTS_NEEDED,
  CANCELLED,
  LOAN_SPECIALIST_ELIGIBLE,
  LOAN_SPECIALIST_PENDING_PREAPPROVAL,
  LOAN_SPECIALIST_PREAPPOVED,
  NEW,
  PENDING_PRE_APPROVAL,
  PRE_APPROVAL_REVIEW_ADDITIONAL_DATA,
  PRE_APPROVAL_SUBMITTED,
  PRE_APPROVAL_SUCCESS,
} from '@app/constants/application'
import { Button, Table } from 'react-bootstrap'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IGetApplicationsDataReceive } from '@app/store/reducers/applications/models'
import React from 'react'
import clsx from 'clsx'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

interface ITableProp extends RouteComponentProps{
  data: IGetApplicationsDataReceive[]
  expireDayCount: number;
}

const TaxPayerTable: React.FC<ITableProp> = (props: ITableProp) => {
  const { data, expireDayCount, history } = props

  const openApplication = (row: IGetApplicationsDataReceive) => (
    e: React.SyntheticEvent<any>
  ) => {
    const { STATUS_STATE, IS_AVAILABLE, ID } = row
    let pathName: string = ''
    if (IS_AVAILABLE) {
      switch (STATUS_STATE) {
        case NEW:
          pathName = `/application/short/${ID}`
          break
        case PRE_APPROVAL_SUCCESS:
          pathName = `/application/main/${ID}`
          break
        case LOAN_SPECIALIST_ELIGIBLE:
        case PRE_APPROVAL_REVIEW_ADDITIONAL_DATA:
        case CANCELLED:
        case PRE_APPROVAL_SUBMITTED:
        case ADDITIONAL_ATTACHMENTS_NEEDED:
          pathName = `/application/advance/${ID}`
          break
        case LOAN_SPECIALIST_PREAPPOVED:
          pathName = `/application/advance/${ID}/results`
          break
        default:
          pathName = `/application/short/${ID}`
          break
      }

      history.push(pathName)
    }
  }

  const getDateDiff = (days: number) => {
    const cls = clsx({
      'text-danger': days >= expireDayCount,
      'text-success': days <= expireDayCount,
    })
    return <span className={cls}>{`${days} օր`}</span>
  }
  return (
    <Table borderless={false} className="mb-0 rounded-table">
      <tbody>
        {data.map(row => (
          <React.Fragment key={row.ID}>
            <tr
              onClick={openApplication(row)}
              className={clsx('bg-gray', {
                'cursor-pointer': row.IS_AVAILABLE,
                'cursor-notallowed': !row.IS_AVAILABLE,
              })}
            >
              <td className="align-middle">
                {row.IS_AVAILABLE ? (
                  <Button variant="link">{row.COMPANY_NAME}</Button>
                ) : (
                  row.COMPANY_NAME
                )}
              </td>
              <td className="align-middle text-center">
                {moment(row.CREATION_DATE).format('DD.MM.YYYY')}
                <span className="w-100 d-block">
                  ({getDateDiff(row.TERM_DAYS)})
                </span>
              </td>
              <td className="align-middle text-center">
                {row.LOAN_TYPE_AM}
                <span className="w-100 d-block">{row.DISPLAY_AMOUNT}</span>
              </td>
              <td className="align-middle">
                <div>
                  {' '}
                  {row.STATUS_AM}
                  {!!row.LOAN_SPECIALIST_NAME.trim() && (
                    <>
                      <br /> assigned {row.LOAN_SPECIALIST_NAME}
                    </>
                  )}
                </div>
                {row.MANUAL_REASON && (
                  <span className="manual-reason-txt">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1 text-primary"/>
                    {row.MANUAL_REASON}
                  </span>
                )}
              </td>
            </tr>
            <tr className="divider">
              <td colSpan={4}></td>
            </tr>
          </React.Fragment>
        ))}
        {!data.length && (
          <tr className="text-center text-danger">
            <td>Նման ՀՎՀՀ ով հայտ չի գտնվել</td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}

export default withRouter(TaxPayerTable)
