import { Button, Modal } from 'react-bootstrap'
import ModalContainer, {
  IModalProps,
} from '@componentContainers/ModalContainer'

import React from 'react'

const Component: React.FC<IModalProps> = props => {
  const { modal, closeModal } = props
  const { state, options } = modal
  const {
    modalProps,
    headerProps,
    children,
    title,
    footer,
    closeButton,
    onHideAction,
    loading,
  } = options

  const onHide = () => {
    closeModal()
    onHideAction && onHideAction()
  }

  return (
    <Modal show={state} onHide={() => onHide()} {...modalProps}>
      <Modal.Header closeButton={true} {...headerProps} ref={undefined}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? <p className="modal-loader">{children}</p> : children}
      </Modal.Body>
      <Modal.Footer>
        {closeButton && (
          <Button variant="secondary" onClick={() => onHide()}>
            Փակել
          </Button>
        )}
        {footer}
      </Modal.Footer>
    </Modal>
  )
}

const LoanModal = ModalContainer(Component)

export default LoanModal
