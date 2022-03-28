import { FieldArray, Formik, getIn } from 'formik'
import { Form, Table } from 'react-bootstrap'

import { IRefinancingLoansData } from '@app/store/reducers/mainApplication/models'
import React from 'react'
import { Utils } from '@app/services/utils'
import { validationSchema } from './validation'

export interface IRefinancingProps {
  data: IRefinancingLoansData[];
  innerRef: React.MutableRefObject<any>;
  disabled?: boolean;
  caption?: boolean;
}

//tslint:disable no-empty
const onSubmit = () => {}

const RefinancingTable: React.FC<IRefinancingProps> = props => {
  const { data, innerRef, disabled, caption = true } = props

  return (
    <>
      <h3 className="refinancing-title">Վերաֆինանսավորվող վարկեր</h3>
      {caption && (
        <p>
          Խնդրում ենք մուտքագրել նշված վարկերի վարկային կոդերը, որոնք կարող եք
          տեսնել Ձեր վարկային պայմանագրերի աջ անկյունում: Վարկային կոդի
          բացակայության դեպքում խնդրում ենք անձը հաստատող փաստաթղթով մոտենալ
          «Ամերիաբանկ» ՓԲԸ-ի ցանկացած մասնաճյուղ կամ կապ հաստատել «Ամերիաբանկ»
          ՓԲԸ-ի հետ (+37410) 56 11 11 հեռախոսահամարով։ «Ամերիաբանկ» ՓԲԸ-ի
          սպասարկման ցանցը և աշխատանքի ժամանակացույցը ներկայացված են{' '}
          <a
            href="http://ameriabank.am/Infrastructure.aspx?&lang=33"
            target="_blank"
          >
            այստեղ։
          </a>
        </p>
      )}

      <Formik
        initialValues={{ loans: data }}
        onSubmit={onSubmit}
        ref={innerRef}
        validationSchema={validationSchema}
        render={({ values, handleSubmit, errors, touched, handleChange }) => (
          <Form id="loansForm" onSubmit={handleSubmit}>
            <Table
              striped={true}
              bordered={true}
              hover={true}
              className="refinancing-table"
            >
              <thead>
                <tr>
                  <th>Բանկի անվանում</th>
                  <th>Վարկատեսակ</th>
                  <th>Վարկի մնացորդ</th>
                  <th>Տարեկան տոկոսադրույք</th>
                  <th>Վարկային կոդ</th>
                </tr>
              </thead>
              <tbody>
                <FieldArray
                  name="loans"
                  render={arrayHelpers =>
                    !!values.loans.length &&
                    values.loans.map((loan, index) => (
                      <tr key={`${loan.ROW_ID}_${loan.APPLICATION_ID}`}>
                        <td>{loan.ORIGINAL_BANK_NAME}</td>
                        <td>{loan.LOAN_TYPE}</td>
                        <td>{`${loan.CURRENCY} ${Utils.formatAsCurrency(
                          loan.CURRENT_BALANCE
                        )}`}</td>
                        <td>{`${loan.INITIAL_INTEREST}%`}</td>
                        <td>
                          <Form.Group controlId={`loans.${index}.LOAN_CODE`}>
                            <Form.Control
                              type="text"
                              name={`loans.${index}.LOAN_CODE`}
                              disabled={disabled}
                              value={String(
                                values.loans[index].LOAN_CODE || ''
                              )}
                              onChange={handleChange}
                              isValid={
                                getIn(touched, `loans.${index}.LOAN_CODE`) &&
                                !getIn(errors, `loans.${index}.LOAN_CODE`)
                              }
                              isInvalid={
                                getIn(touched, `loans.${index}.LOAN_CODE`) &&
                                !!getIn(errors, `loans.${index}.LOAN_CODE`)
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {getIn(errors, `loans.${index}.LOAN_CODE`)}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </td>
                      </tr>
                    ))
                  }
                />
              </tbody>
            </Table>
          </Form>
        )}
      />
    </>
  )
}

export default RefinancingTable
