import { Button, Spinner } from 'react-bootstrap'

import React from 'react'

export interface IAdvanceActionsProps {
  submitLoading?: boolean;
  handleFormSave: (e: React.SyntheticEvent<any>) => void
  saveLoading?: boolean;
  disabled?: boolean;
  cancelAction: () => void
}
export const ActionButtons: React.FC<IAdvanceActionsProps> = props => {
  const { submitLoading, disabled, saveLoading, handleFormSave, cancelAction } = props

  return (
    <>
      <Button
        variant="danger"
        className="mr-3 min-w-100"
        onClick={cancelAction}
        disabled={disabled}
      >
        Չեղարկել
      </Button>

      <Button
        variant="outline-primary"
        className="mr-3 min-w-100"
        onClick={handleFormSave}
        disabled={disabled || saveLoading}
        type="submit"
      >
        {saveLoading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mr-1"
            variant="primary"
          />
        )}
        Հիշել
      </Button>

      <Button
        className="min-w-100"
        disabled={disabled || submitLoading}
        form="advApplicationForm"
        type="submit"
      >
        {submitLoading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mr-1"
            variant="primary"
          />
        )}
        Հաստատել
      </Button>
    </>
  )
}
