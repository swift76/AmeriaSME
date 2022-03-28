import { ModalHeaderProps } from 'react-bootstrap/ModalHeader'
import { ModalProps } from 'react-bootstrap'
import React from 'react'

export interface IModalOptions {
  children: React.ReactNode | string;
  loading?: boolean,
  modalProps?: ModalProps;
  headerProps?: ModalHeaderProps;
  footer?: React.ReactNode | string
  title?: string;
  closeButton?: boolean
  onHideAction?: () => void
}
