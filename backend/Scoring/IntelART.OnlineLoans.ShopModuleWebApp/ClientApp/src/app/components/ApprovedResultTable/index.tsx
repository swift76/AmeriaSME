import { Button, Form, Spinner, Table } from 'react-bootstrap'
import {
  IPreApprovedResultsData,
  IPreApprovedResultsPostData,
} from '@app/store/reducers/preapprovedResults/models'
import React, { useEffect, useRef, useState } from 'react'
import { getRefinansingLoan, postRefinansingLoan } from '@app/api/Application'

import { IRefinancingLoansData } from '@app/store/reducers/mainApplication/models'
import RefinancingTable from '@components/RefinancingTable/index'
import ResultTableHeader from './ResultTableHeader'
import { Utils } from '@app/services/utils'
import clsx from 'clsx'

export interface IApprovedTableProps extends IPreApprovedResultsData {
  applicationId: string;
  currency: string;
  acceptScoring: (data: IPreApprovedResultsPostData) => void;
}

const ApprovedResultTable: React.FC<IApprovedTableProps> = props => {
  const {
    ID,
    IS_REFINANCING,
    APPROVED_AMOUNT,
    INTEREST,
    LOAN_TERM,
    MONTHLY_PAYMENT_AMOUNT,
    REQUIRED_MOVABLE_ESTATE,
    REQUIRED_REAL_ESTATE,
    currency,
  } = props
  const isLoanConditional = !!(REQUIRED_MOVABLE_ESTATE || REQUIRED_REAL_ESTATE)
  const [refinansingLoading, setRefinansingLoading] = useState(false)
  const [conditionError, setConditionError] = useState(false)
  const [IsRealEstate, setIsRealEstate] = useState<boolean | undefined>()
  const refinancingForm = useRef<any>(null)
  const [refinansingLoans, setRefinansingLoans] = useState<
    IRefinancingLoansData[]
  >([])

  const chooseLoanCondition = (e: React.FormEvent<HTMLInputElement>) => {
    setIsRealEstate(e.currentTarget.value === 'true')
  }

  const handleAccept = async (e: React.SyntheticEvent<any>) => {
    const refIsValid = await checkRefInansingValidity()
    if ((isLoanConditional && IsRealEstate === undefined) || !refIsValid) {
      setConditionError(true)
      return false
    }

    props.acceptScoring({
      Id: ID,
      IsRealEstate:
        IsRealEstate === undefined ? isLoanConditional : IsRealEstate,
    })

    if (refinancingForm.current) {
      const { values } = refinancingForm.current.state
      const data = values.loans
      postRefinansingLoan(props.applicationId, data)
    }

    return true
  }

  const checkRefInansingValidity = async () => {
    const refForm = refinancingForm.current

    if (!refForm) {
      return Promise.resolve(true)
    }

    refForm.handleSubmit()
    const errors = await refForm.validateForm()
    return Promise.resolve(!errors.loans)
  }

  useEffect(() => {
    if (IsRealEstate !== undefined) {
      setConditionError(false)
    }
  }, [IsRealEstate])

  useEffect(() => {
    if (IS_REFINANCING) {
      setRefinansingLoading(true)
      getRefinansingLoan(props.applicationId)
        .then(data => {
          setRefinansingLoans(data)
        })
        .finally(() => {
          setRefinansingLoading(false)
        })
    }
  }, [IS_REFINANCING])

  return (
    <div className="adv-table-wrapper">
      <h3 className="adv-table-title text-success mb-3">
        {IS_REFINANCING ? `Վերաֆինանսավորմամբ` : `Առանց վերաֆինանսավորման`}
      </h3>
      <Table borderless={true} className="adv-result-table">
        <ResultTableHeader refinancing={IS_REFINANCING} />
        <tbody className="adv-table-content">
          <tr>
            <td>{`${LOAN_TERM} ամիս`}</td>
            <td>{`${Utils.formatAsCurrency(APPROVED_AMOUNT)} ${currency}`}</td>
            <td>{`${INTEREST}%`}</td>
            <td>
              {`${Utils.formatAsCurrency(MONTHLY_PAYMENT_AMOUNT)} ՀՀ դրամ`}
            </td>
          </tr>
        </tbody>

        {isLoanConditional && (
          <tbody>
            <tr className="transparent">
              <td colSpan={4}>
                <strong className="text-success">Գրավի պայման</strong>
              </td>
            </tr>
            {!!REQUIRED_MOVABLE_ESTATE && (
              <tr onClick={() => setIsRealEstate(false)}>
                <td>
                  <Form.Check
                    inline={true}
                    type="radio"
                    name={`IsRealEstate.${ID}`}
                    value="false"
                    id={`not-real-estate-${ID}`}
                    checked={IsRealEstate === false}
                    onChange={chooseLoanCondition}
                    isInvalid={conditionError}
                  />
                </td>
                <td
                  className={clsx({
                    'text-danger': conditionError,
                  })}
                >
                  Շարժական գույքի նվազագույն լիկվիդային արժեք
                </td>
                <td colSpan={2}>
                  {' '}
                  {`${Utils.formatAsCurrency(REQUIRED_MOVABLE_ESTATE)} ՀՀ դրամ`}
                </td>
              </tr>
            )}
            {!!REQUIRED_REAL_ESTATE && (
              <tr className="transparent" onClick={() => setIsRealEstate(true)}>
                <td>
                  <Form.Check
                    inline={true}
                    type="radio"
                    value="true"
                    name={`IsRealEstate.${ID}`}
                    id={`real-estate-${ID}`}
                    checked={IsRealEstate === true}
                    onChange={chooseLoanCondition}
                    isInvalid={conditionError}
                  />
                </td>
                <td
                  className={clsx({
                    'text-danger': conditionError,
                  })}
                >
                  Անշարժ գույքի նվազագույն լիկվիդային արժեք
                </td>
                <td colSpan={2}>
                  {`${Utils.formatAsCurrency(REQUIRED_REAL_ESTATE)} ՀՀ դրամ`}
                </td>
              </tr>
            )}
          </tbody>
        )}

        {IS_REFINANCING && (
          <tbody className="mt-3">
            <tr className="transparent">
              <td colSpan={4}>
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
                    caption={false}
                  />
                )}
              </td>
            </tr>
          </tbody>
        )}

        <tbody>
          <tr className="transparent">
            <td colSpan={4} className="text-right">
              <Button onClick={handleAccept}>Ընդունել</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default ApprovedResultTable
