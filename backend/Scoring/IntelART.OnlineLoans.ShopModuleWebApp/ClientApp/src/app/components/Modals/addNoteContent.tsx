import { Form } from 'react-bootstrap'
import { Formik } from 'formik'
import React from 'react'

export interface IAddNoteModalContentProps {
  comment: string;
  onSubmit: (values: { COMMENT: string }) => void;
}

const AddNoteModalContent: React.SFC<IAddNoteModalContentProps> = props => {
  const { onSubmit, comment } = props

  return (
    <Formik
      initialValues={{ COMMENT: comment }}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ handleSubmit, handleChange, values }) => (
        <Form onSubmit={handleSubmit} id="addNewCommentForm">
          <Form.Control
            as="textarea"
            name="COMMENT"
            rows={3}
            value={values.COMMENT || ''}
            onChange={handleChange}
          />
        </Form>
      )}
    </Formik>
  )
}

export default AddNoteModalContent
