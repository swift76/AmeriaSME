import { Button, Col, Form, Spinner, Table } from 'react-bootstrap'
import { FieldArray, FormikProps, getIn } from 'formik'
import React, { useEffect, useState } from 'react'
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IAppRelatedPersons } from 'app/store/reducers/common-models'
import { ILoanSpecApplicationData } from 'app/store/reducers/loanSpecApplication/models'
import { Utils } from 'app/services/utils'

interface IRelatedPersonsProps extends FormikProps<ILoanSpecApplicationData> {
  title?: string;
  dataName: string;
  loading?: boolean;
  rowName: string;
}

const AppRelatedPersons: React.FC<IRelatedPersonsProps> = props => {
  const {
    title,
    loading,
    dataName,
    rowName,
    values,
    touched,
    errors,
    handleChange,
  } = props

  const data: IAppRelatedPersons[] = values[dataName]

  const removeRow = (index: number, remove: (index: number) => void) => (
    e: React.SyntheticEvent<any>
  ) => remove(index)

  const addNewRow = (push: (obj: any) => void) => (
    e: React.SyntheticEvent<any>
  ) => {
    push({ NAME: '', DOCUMENT_NUMBER: '' })
  }

  return (
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
          name={dataName}
          render={arrayHelpers => (
            <>
              {data.length ? (
                data.map((row, index) => {
                  const key = `${dataName}.row.${index}`
                  const name = `${dataName}.${index}.NAME`
                  const docNumber = `${dataName}.${index}.DOCUMENT_NUMBER`
                  return (
                    <tr key={key}>
                      <td className="name-col">{rowName}</td>
                      <td>
                        <Form.Row>
                          <Form.Group as={Col} sm={5} controlId={name}>
                            <Form.Control
                              name={name}
                              type="text"
                              value={data[index].NAME}
                              onChange={Utils.formatInputValue(handleChange, {
                                pattern: /^[a-zA-Z\s]*$/,
                              })}
                              placeholder="Անուն Ազգանուն/Անվանում"
                              isValid={
                                getIn(touched, name) && !getIn(errors, name)
                              }
                              isInvalid={
                                getIn(touched, name) && !!getIn(errors, name)
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {getIn(errors, name)}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group
                            as={Col}
                            sm={3}
                            controlId={docNumber}
                            className="mb-0"
                          >
                            <Form.Control
                              name={docNumber}
                              type="text"
                              maxLength={10}
                              value={data[index].DOCUMENT_NUMBER}
                              onChange={Utils.formatInputValue(handleChange, {
                                pattern: /^[0-9]*$/,
                              })}
                              placeholder="ՀԾՀ/ՀՎՀՀ"
                              isValid={
                                getIn(touched, docNumber) &&
                                !getIn(errors, docNumber)
                              }
                              isInvalid={
                                getIn(touched, docNumber) &&
                                !!getIn(errors, docNumber)
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {getIn(errors, docNumber)}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Form.Row>
                      </td>
                      <td>
                        {index !== 0 && (
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={removeRow(index, arrayHelpers.remove)}
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="mr-1 text-danger"
                            />
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <>
                  <tr>
                    <td colSpan={4}>{`Չկա ավելացված ${title &&
                      title.toLowerCase()}`}</td>
                  </tr>
                  {touched[dataName] && errors[dataName] && (
                    <tr>
                      <td colSpan={4}>
                        <p className="text-danger mb-0">{errors[dataName]}</p>
                      </td>
                    </tr>
                  )}
                </>
              )}
              <tr className="bg-transparent">
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
                    Ավելացնել
                  </Button>
                </td>
              </tr>
            </>
          )}
        />
      )}
    </tbody>
  )
}

export default AppRelatedPersons
