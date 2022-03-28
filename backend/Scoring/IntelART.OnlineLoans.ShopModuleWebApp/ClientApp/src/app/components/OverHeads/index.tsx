import { Button, Form, Row, Spinner, Table } from 'react-bootstrap'
import { FieldArray, FormikProps, getIn } from 'formik'
import {
  IOverheadsData,
  ISelectDataReceive,
} from '@app/store/reducers/common-models'
import React, { useEffect, useState } from 'react'
import {
  faPencilAlt,
  faPlus,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ILoanSpecApplicationData } from '@app/store/reducers/loanSpecApplication/models'
import NumberFormat from 'react-number-format'
import { ReducerState } from 'AppTypes'
import { Utils } from '@app/services/utils'
import _ from 'lodash'
import clsx from 'clsx'

export interface IOverHeadsProps extends FormikProps<ILoanSpecApplicationData> {
  loading?: boolean;
}

const OverHeads: React.FC<IOverHeadsProps> = props => {
  const { formatAsCurrency } = Utils
  const {
    loading,
    values,
    touched,
    errors,
    handleChange,
    setFieldValue,
    setError,
  } = props
  const industryProducts = useSelector(
    (state: ReducerState) => state.loanAppGroupData.industryProducts
  )
  const industryTypes = useSelector(
    (state: ReducerState) => state.loanAppGroupData.industryTypes
  )
  const [isEditables, setIsEditables] = useState({})

  const data: IOverheadsData[] = values.OVERHEADS

  const profits = values.PROFITS

  useEffect(() => {
    for (const iterator of data) {
      if (
        iterator.PRODUCTS.length < industryProducts.data.length &&
        iterator.CODE !== ''
      ) {
        iterator.PRODUCTS = _.uniqBy(
          iterator.PRODUCTS.concat(getProducs(iterator.NAME)),
          'INDUSTRY_PRODUCT_CODE'
        )
      }
    }
  }, [data])

  const getProducs = (name: string | undefined) => {
    return industryProducts.data.map(product => {
      return {
        NAME: name || '',
        INDUSTRY_PRODUCT_NAME: product.NAME,
        INDUSTRY_PRODUCT_CODE: product.CODE,
        NET_AMOUNT: 0,
        SALE_AMOUNT: 0,
        PRODUCT_PERCENTAGE: 0,
      }
    })
  }

  const addNewRow = (push: (obj: any) => void) => (
    e: React.SyntheticEvent<any>
  ) => {
    const newCodeName = `OVERHEADS.${data.length}.CODE`
    push({
      CODE: '',
      NAME: '',
      PRODUCTS: [],
    })

    setIsEditables({
      ...isEditables,
      [newCodeName]: true,
    })
  }

  const getIsValid = (name: string) =>
    getIn(touched, name) && !getIn(errors, name)

  const getIsInValid = (name: string) =>
    getIn(touched, name) && !!getIn(errors, name)

  const enableFormControl = (fieldName: string) => (
    e: React.SyntheticEvent<any>
  ) => {
    setIsEditables({
      ...isEditables,
      [fieldName]: !isEditables[fieldName],
    })
  }

  const isFieldDisabled = (name: string) => !isEditables[name]

  return (
    <div className={`adv-loan-section`} id="companyOverheads">
      <h5 className="adv-loan-title">Վերադիր</h5>
      <Table striped={true} borderless={true} className="adv-loan-table">
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center">
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="mr-1"
                  variant="primary"
                />
              </td>
            </tr>
          ) : (
            <FieldArray
              name="OVERHEADS"
              render={arrayHelpers => (
                <>
                  {data.length ? (
                    data.map((row, index) => {
                      const rowName = `OVERHEADS.row.${index}`
                      const codeName = `OVERHEADS.${index}.CODE`
                      const { PRODUCTS } = row
                      return (
                        <React.Fragment key={rowName}>
                          <tr>
                            <td className="name-col">
                              <Form.Group
                                controlId={rowName}
                                className="inline-block"
                              >
                                <Form.Control
                                  as="select"
                                  name={codeName}
                                  value={data[index].CODE || ''}
                                  onChange={handleChange}
                                  className="control-200"
                                  isValid={getIsValid(codeName)}
                                  isInvalid={getIsInValid(codeName)}
                                  disabled={isFieldDisabled(codeName)}
                                  plaintext={isFieldDisabled(codeName)}
                                >
                                  <option value="">Ընտրել</option>
                                  {profits
                                    .filter(
                                      industry =>
                                        (data[index].CODE &&
                                          data[index].CODE === industry.CODE) ||
                                        !data.find(
                                          dd => dd.CODE === industry.CODE
                                        )
                                    )
                                    .map(industry => (
                                      <option
                                        key={industry.CODE}
                                        value={industry.CODE}
                                      >
                                        {Utils.getNameByCode(
                                          industry.CODE,
                                          industryTypes.data
                                        )}
                                      </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                  {getIn(errors, codeName)}
                                </Form.Control.Feedback>
                                <Button
                                  className="btn-transparent"
                                  variant="link"
                                  onClick={enableFormControl(codeName)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPencilAlt}
                                    className="mr-1 text-primary"
                                  />
                                </Button>
                              </Form.Group>
                            </td>
                            <td className="text-right">
                              <Button
                                variant="link"
                                className="p-0"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  className="mr-1 text-danger"
                                />
                              </Button>
                            </td>
                          </tr>
                          {PRODUCTS.length ? (
                            <tr>
                              <td colSpan={2} className="w-full p-0">
                                <FieldArray
                                  name={`OVERHEADS.${index}.PRODUCTS`}
                                  render={arrayHelpers1 => (
                                    <Table
                                      striped={true}
                                      borderless={true}
                                      className="adv-loan-table sub-table"
                                    >
                                      <thead>
                                        <tr className="bg-gray">
                                          <th>Ապրանքի համար</th>
                                          <th>Ապրանքի ինքնարժեք</th>
                                          <th>Ապրանքի վաճառքի գին</th>
                                          <th>Մասնաբաժինը վաճառքների մեջ</th>
                                        </tr>
                                        <tr>
                                          <td>Ընդհանուր</td>
                                          <td>
                                            <strong>{`${formatAsCurrency(
                                              _.sumBy(PRODUCTS, d =>
                                                Number(d.NET_AMOUNT)
                                              )
                                            )} դրամ`}</strong>
                                          </td>
                                          <td>
                                            <strong>
                                              {`${formatAsCurrency(
                                                _.sumBy(PRODUCTS, d =>
                                                  Number(d.SALE_AMOUNT)
                                                )
                                              )} դրամ`}
                                            </strong>
                                          </td>
                                          <td>
                                            <div className="product-percentage-total">
                                              <Form.Control
                                                name={`OVERHEADS.${index}.PRODUCT_PERCENTAGE_TOTAL`}
                                                type="number"
                                                value={String(
                                                  _.sumBy(PRODUCTS, d =>
                                                    Number(d.PRODUCT_PERCENTAGE)
                                                  )
                                                )}
                                                readOnly={true}
                                                plaintext={true}
                                                isInvalid={
                                                  !!getIn(
                                                    errors,
                                                    `OVERHEADS.${index}.PRODUCT_PERCENTAGE_TOTAL`
                                                  )
                                                }
                                              />
                                              <span className="percent-symbol">
                                                %
                                              </span>
                                            </div>
                                            <p className="text-danger mb-0">
                                              {getIn(
                                                errors,
                                                `OVERHEADS.${index}.PRODUCT_PERCENTAGE_TOTAL`
                                              )}
                                            </p>
                                          </td>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {PRODUCTS.map((product, i) => {
                                          const obj =
                                            values.OVERHEADS[index].PRODUCTS[i]
                                          const net: string = `OVERHEADS.${index}.PRODUCTS.${i}.NET_AMOUNT`
                                          const sale = `OVERHEADS.${index}.PRODUCTS.${i}.SALE_AMOUNT`
                                          const prodPerc = `OVERHEADS.${index}.PRODUCTS.${i}.PRODUCT_PERCENTAGE`
                                          return (
                                            <tr
                                              key={`${product.INDUSTRY_PRODUCT_CODE}-row.${i}`}
                                            >
                                              <td>
                                                <Form.Label htmlFor={net}>
                                                  {
                                                    product.INDUSTRY_PRODUCT_NAME
                                                  }
                                                </Form.Label>
                                              </td>
                                              <td>
                                                <Form.Group
                                                  controlId={net}
                                                  as={Row}
                                                >
                                                  <NumberFormat
                                                    thousandSeparator={true}
                                                    allowNegative={false}
                                                    onFocus={() => {
                                                      obj.NET_AMOUNT === 0 &&
                                                        setFieldValue(net, '')
                                                    }}
                                                    onValueChange={val => {
                                                      setFieldValue(
                                                        net,
                                                        val.value
                                                      )
                                                    }}
                                                    name={net}
                                                    value={String(
                                                      obj.NET_AMOUNT
                                                    )}
                                                    customInput={Form.Control}
                                                    className={clsx({
                                                      'is-valid': getIsValid(
                                                        net
                                                      ),
                                                      'is-invalid': getIsInValid(
                                                        net
                                                      ),
                                                    })}
                                                  />
                                                  <span className="form-label col-form-label ml-1">
                                                    դրամ
                                                  </span>
                                                  <Form.Control.Feedback type="invalid">
                                                    {getIn(errors, net)}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </td>
                                              <td>
                                                <Form.Group
                                                  controlId={sale}
                                                  as={Row}
                                                >
                                                  <NumberFormat
                                                    thousandSeparator={true}
                                                    allowNegative={false}
                                                    onFocus={() => {
                                                      obj.SALE_AMOUNT === 0 &&
                                                        setFieldValue(sale, '')
                                                    }}
                                                    onValueChange={val => {
                                                      setFieldValue(
                                                        sale,
                                                        val.value
                                                      )
                                                    }}
                                                    name={sale}
                                                    value={String(
                                                      obj.SALE_AMOUNT
                                                    )}
                                                    customInput={Form.Control}
                                                    className={clsx({
                                                      'is-valid': getIsValid(
                                                        sale
                                                      ),
                                                      'is-invalid': getIsInValid(
                                                        sale
                                                      ),
                                                    })}
                                                  />
                                                  <span className="form-label col-form-label ml-1">
                                                    դրամ
                                                  </span>
                                                  <Form.Control.Feedback type="invalid">
                                                    {getIn(errors, sale)}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </td>
                                              <td className="w-auto">
                                                <Form.Group
                                                  controlId={prodPerc}
                                                  as={Row}
                                                >
                                                  <Form.Control
                                                    name={prodPerc}
                                                    type="number"
                                                    min={0}
                                                    value={String(
                                                      obj.PRODUCT_PERCENTAGE
                                                    )}
                                                    onChange={handleChange}
                                                    isValid={getIsValid(
                                                      prodPerc
                                                    )}
                                                    isInvalid={getIsInValid(
                                                      prodPerc
                                                    )}
                                                  />
                                                  <span className="form-label col-form-label ml-1">
                                                     %
                                                  </span>
                                                  <Form.Control.Feedback type="invalid">
                                                    {getIn(errors, prodPerc)}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </td>
                                            </tr>
                                          )
                                        })}
                                      </tbody>
                                    </Table>
                                  )}
                                />
                              </td>
                            </tr>
                          ) : null}
                        </React.Fragment>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={4}>{`Չկա ավելացված վերադիրի տեսակ`}</td>
                    </tr>
                  )}
                  {profits.length > data.length && (
                    <tr className="bg-transparent ">
                      <td colSpan={4}>
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={addNewRow(arrayHelpers.push)}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="mr-1 text-primary"
                          />
                          {`Ավելացնել`}
                        </Button>
                      </td>
                    </tr>
                  )}
                </>
              )}
            />
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default OverHeads
