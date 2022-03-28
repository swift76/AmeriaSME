import { Col, Container, Form, Row } from 'react-bootstrap'
import { NEW, PENDING_PRE_APPROVAL } from 'app/constants/application'
import React, { useEffect, useRef, useState } from 'react'
import ShortApplicationContainer, {
  IShortAppProps,
} from '@pageContainers/ShortApplicationContainer'
import {
  mapDataFromServer,
  mapDataToServer,
  validationSchema,
} from './components/shortApplication/helper'

import { ActionButtons } from './components/shortApplication/ActionButtons'
import BackButton from '@app/components/BackButton'
import CompanyHomeAddress from './components/shortApplication/CompanyHomeAddress'
import { Formik } from 'formik'
import { IApplicationData } from '@store/reducers/application/models'
import LegalPersonHomeAddress from './components/shortApplication/LegalPersonHomeAddress'
import LegalPersonInfo from './components/shortApplication/LegalPersonInfo'
import LoanBaseFields from './components/shortApplication/LoanBaseFields'
import LoanInfoFields from './components/shortApplication/LoanInfoFields'
import _ from 'lodash'
import { useMonitoring } from '@app/hooks/monitoring'

const Page: React.FC<IShortAppProps> = props => {
  const {
    match,
    history,
    getApplication,
    industires,
    application,
    getAddressCountries,
    getStates,
    getCities,
    addresses,
    activities,
    getIndustries,
    getActivities,
    getLatestApplication,
    saveApplication,
  } = props
  const { id } = match.params
  const { taxIdNumber } = props.params
  const isNewApp = !id
  const appForm = useRef<any>(null)
  const [submitLoading, setSumbitLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [formDisabled, setFormDisabled] = useState(false)
  const status = application.data.STATUS_STATE

  // TODO: enable later
  // !taxIdNumber && isNewApp && history.push('/')

  const onValidSubmit = (values: IApplicationData) => {
    const data = mapDataToServer(values)
    setSumbitLoading(true)
    saveApplication(data)
      .then((newAppId: string) => {
        setSumbitLoading(false)
        getApplication(newAppId)
      })
      .catch(() => {
        setSumbitLoading(false)
      })
  }

  const onInvalidSubmit = async (values: IApplicationData) => {
    if (validateReqFieldsOnSave()) {
      setSaveLoading(true)
      try {
        const newId = await saveApplication(mapDataToServer(values))
        history.replace(`/application/short/${newId}`)
      } finally {
        setSaveLoading(false)
      }
    }
  }

  const validateReqFieldsOnSave = (): boolean => {
    if (appForm.current) {
      const { setFieldTouched, state } = appForm.current
      setFieldTouched('LOAN_TYPE_ID', true, true)
      setFieldTouched('TAX_ID_NUMBER', true, true)
      return !!(state.values.LOAN_TYPE_ID && state.values.TAX_ID_NUMBER)
    }
    return false
  }

  const handleSubmitForm = (isSubmiting: boolean) => {
    if (appForm.current) {
      const { state, submitForm } = appForm.current
      const { values } = state
      values.IS_SUBMIT = isSubmiting
      values.AGREED_WITH_TERMS = isSubmiting
      isSubmiting ? submitForm() : onInvalidSubmit(values)
    }
  }

  useEffect(() => {
    const { addressCountries, states } = addresses

    if (id) {
      getApplication(id)
    } else {
      taxIdNumber && getLatestApplication(taxIdNumber)
    }
    !industires.data.length && getIndustries()
    !addressCountries.data.length && getAddressCountries()
    !states.data.length && getStates()
    !activities.data.length && getActivities()
  }, [id])

  useEffect(() => {
    status &&
      setFormDisabled(!(status === NEW || status === PENDING_PRE_APPROVAL))
  }, [status])

  useMonitoring(id, 0.5)

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
                  {isNewApp
                    ? `Նոր վարկի հայտ`
                    : `Վարկային հայտ #${application.data.ISN}`}
                </h2>
              </div>
            </Col>
            <Col xs={true} className="text-right">
              <ActionButtons
                handleSubmitForm={handleSubmitForm}
                submitLoading={submitLoading}
                saveLoading={saveLoading}
                disabled={formDisabled}
              />
            </Col>
          </Row>
          <hr className="mt-1" />
          <Row>
            <Col
              md={{ span: 12 }}
              lg={{ span: 8, offset: 2 }}
              xl={{ span: 6, offset: 3 }}
            >
              <Formik
                initialValues={{
                  ...mapDataFromServer(application.data, taxIdNumber),
                }}
                onSubmit={onValidSubmit}
                validationSchema={validationSchema}
                ref={appForm}
                enableReinitialize={true}
              >
                {formProps => (
                  <fieldset disabled={formDisabled}>
                    <Form
                      className="loan-form"
                      noValidate={true}
                      onSubmit={formProps.handleSubmit}
                    >
                      <LoanBaseFields {...formProps} industries={industires} />
                      <LoanInfoFields
                        {...formProps}
                        title="Վարկի մասին տեղեկատվություն"
                      />
                      <CompanyHomeAddress
                        {...formProps}
                        addresses={addresses}
                        getCities={getCities}
                        title="Կազմակերպության փաստացի հասցե"
                      />
                      <LegalPersonInfo
                        {...formProps}
                        activities={activities}
                        title="Իրավաբանական անձի տնօրենի / ԱՁ-ի անձնական տվյալներ"
                      />
                      <LegalPersonHomeAddress
                        {...formProps}
                        addresses={addresses}
                        getCities={getCities}
                        title="Իրավաբանական անձի տնօրենի / ԱՁ-ի անձնական փաստացի հասցե"
                      />
                    </Form>
                  </fieldset>
                )}
              </Formik>
            </Col>
          </Row>
          {/* bottom actions */}
          <hr className="mt-3 mb-3" />
          <Row>
            <Col xs={true} className="text-right mb-5">
              <ActionButtons
                handleSubmitForm={handleSubmitForm}
                submitLoading={submitLoading}
                saveLoading={saveLoading}
                disabled={formDisabled}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

const ShortApplication = ShortApplicationContainer(Page)

export default ShortApplication
