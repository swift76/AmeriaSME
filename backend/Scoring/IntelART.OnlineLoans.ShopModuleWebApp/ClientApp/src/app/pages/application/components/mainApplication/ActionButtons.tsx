import { Button, Spinner } from 'react-bootstrap'

import React from 'react'

export interface IMainActionsProps {
  cancelApplication?: () => void;
  refuseConditions?: () => void;
  submitLoading?: boolean;
  disabled?: boolean;
}

export const ActionButtons: React.FC<IMainActionsProps> = props => {
  const { submitLoading, cancelApplication, refuseConditions, disabled } = props

  return (
    <>
      <Button
        variant="danger"
        className="mr-3 min-w-100"
        onClick={cancelApplication}
        disabled={disabled}
      >
        Հրաժարվել
      </Button>

      <Button
        variant="outline-danger"
        className="mr-3 min-w-100"
        onClick={refuseConditions}
        disabled={disabled}
      >
        Մերժել
      </Button>

      <Button
        className="min-w-100"
        disabled={disabled || submitLoading}
        type="submit"
        form="mainApplicationForm"
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
        Ընդունել
      </Button>
    </>
  )
}
