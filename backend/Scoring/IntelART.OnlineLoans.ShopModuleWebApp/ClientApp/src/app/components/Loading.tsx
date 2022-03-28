import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loading: React.FC = () => {
  return (
    <div className="d-flex w-100 h-100 justify-content-center align-items-center">
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  )
}

export default Loading
