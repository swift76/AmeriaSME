import {
  BANK_REVIEW,
  BANK_REVIEW_SUPERVISOR,
  LOAN_SPECIALIST_ELIGIBLE,
  LOAN_SPECIALIST_PREAPPOVED,
  NEW,
  PRE_APPROVAL_FAIL,
  PRE_APPROVAL_REVIEW_ADDITIONAL_DATA,
  PRE_APPROVAL_SUCCESS,
  PRE_APPROVAL_SUBMITTED,
  AGREED,
  LOAN_SPECIALIST_PENDING_PREAPPROVAL as ls_pending,
  PENDING_PRE_APPROVAL as pending,
} from 'app/constants/application'
import React, { useEffect, useRef, useState } from 'react'
import {
  closeModal,
  openModal,
  setModalOptions,
} from 'app/store/reducers/settings/modals/actions'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from 'react-bootstrap'
import { IModalOptions } from 'app/store/reducers/settings/modals/models'
import { ReducerState } from 'AppTypes'
import { Utils } from '../services/utils'
import { getApplication } from 'app/api/Application'
import history from '../../browserHistory'
import localization from 'app/locale/hy/global.json'
import { resetApplication } from 'app/store/reducers/application/actions'

const { TITLE_TXT, CONTENT_TXT } = localization.modalTxt

export const useMonitoring = (id: string, scoringMinute: number = 3) => {
  const timeoutRefId = useRef<any>()
  const dispatch = useDispatch()
  const application = useSelector((state: ReducerState) => state.application)
  const modalState = useSelector(
    (state: ReducerState) => state.settings.modal.state
  )
  const [pollingTime, setPollingTime] = useState(0)
  const [isTakeLong, setIsTakeLong] = useState(false)
  const status = application.data.STATUS_STATE
  const waitTimeout = scoringMinute * 60 * 1000
  const pollingInterval = 1000
  const isPollingStatus = status === ls_pending || status === pending
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (application.applocationLoaded && isPollingStatus && !isTakeLong) {
      setShowModal(true)
      setPollingTime(pollingTime + pollingInterval)
      timeoutRefId.current = setTimeout(() => {
        dispatch(getApplication(application.data.ID))
      }, pollingInterval)
    }
  }, [application.applocationIsLoading])

  useEffect(() => {
    return () => {
      dispatch(resetApplication())
      if (timeoutRefId.current) {
        clearTimeout(timeoutRefId.current)
      }
    }
  }, [])

  useEffect(() => {
    showModal &&
      dispatch(
        openModal({
          children: CONTENT_TXT.WAITING,
          title: TITLE_TXT.REQUEST_PROGRESS,
          loading: true,
        })
      )
  }, [showModal])

  useEffect(() => {
    if (!modalState && showModal) {
      setShowModal(false)
      history.push('/')
    }
  }, [modalState])

  useEffect(() => {
    pollingTime > waitTimeout && setIsTakeLong(true)
  }, [pollingTime])

  useEffect(() => {
    if (isTakeLong && showModal) {
      dispatch(
        setModalOptions({
          children: CONTENT_TXT.TECHNICAL_WARNING,
          loading: false,
          title: 'Կատարվել է հարցում',
        })
      )
    }
  }, [isTakeLong])

  useEffect(() => {
    const appId = application.data.ID
    const options: IModalOptions = { children: '', loading: false }
    // options when modal opened

    if (showModal && status) {
      switch (status) {
        case NEW:
        case LOAN_SPECIALIST_ELIGIBLE:
          break

        case PRE_APPROVAL_FAIL:
          dispatch(
            setModalOptions({
              ...options,
              footer: '',
              children: CONTENT_TXT.TECHNICAL_WARNING,
              title: 'Կատարվել է հարցում',
            })
          )
          break
        case PRE_APPROVAL_REVIEW_ADDITIONAL_DATA:
          dispatch(
            setModalOptions({
              ...options,
              children: CONTENT_TXT.ADDITIONAL_DATA,
              title: TITLE_TXT.ADDITIONAL_TITLE,
              footer: (
                <Button
                  variant="primary"
                  onClick={() => {
                    dispatch(closeModal())
                    history.push(`/application/advance/${appId}`)
                  }}
                >
                  Շարունակել
                </Button>
              ),
            })
          )
          break
        case PRE_APPROVAL_SUCCESS:
        case LOAN_SPECIALIST_PREAPPOVED:
          Utils.getApprovedModalOptions(id).then(approvedOpt => {
            const loanPage =
              status === LOAN_SPECIALIST_PREAPPOVED
                ? `/application/advance/${appId}/results`
                : `/application/main/${appId}`
            dispatch(
              setModalOptions({
                ...options,
                ...approvedOpt,
                footer: (
                  <Button
                    variant="primary"
                    onClick={() => {
                      dispatch(closeModal())
                      history.push(loanPage)
                    }}
                  >
                    Շարունակել
                  </Button>
                ),
              })
            )
          })
          break

        default:
          break
      }
    }

    switch (status) {
      case BANK_REVIEW:
      case BANK_REVIEW_SUPERVISOR:
      case PRE_APPROVAL_SUBMITTED:
      case AGREED:
        dispatch(
          openModal({
            children: 'Վարկը ուղարկված Է հաստատման',
            title: 'Ուղարկված Է հաստատման',
            loading: false,
            footer: '',
            onHideAction: () => {
              history.push('/')
            },
          })
        )
        break

      default:
        break
    }
  }, [status])
}
