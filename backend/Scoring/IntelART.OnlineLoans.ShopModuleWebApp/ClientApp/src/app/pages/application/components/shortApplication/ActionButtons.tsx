import { Button, Spinner } from 'react-bootstrap'

import React from 'react'

export interface IShortActionsProps {
  handleSubmitForm: (isSubmit: boolean) => void;
  disabled?: boolean;
  submitLoading?: boolean;
  saveLoading?: boolean;
}

export const ActionButtons: React.FC<IShortActionsProps> = props => {
  const { handleSubmitForm, submitLoading, saveLoading, disabled } = props

  const handleSubmit = (isSubmit: boolean) => (
    e: React.SyntheticEvent<any>
  ) => {
    handleSubmitForm(isSubmit)
  }

  return (
    <>
      <Button
        variant="outline-primary"
        className="mr-3 min-w-100"
        onClick={handleSubmit(false)}
        disabled={disabled || saveLoading}
      >
        {saveLoading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mr-1"
          />
        )}
        Հիշել
      </Button>

      <Button
        className="min-w-100"
        disabled={disabled || submitLoading}
        onClick={handleSubmit(true)}
      >
        {submitLoading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mr-1"
          />
        )}
        Ուղարկել
      </Button>
    </>
  )
}
