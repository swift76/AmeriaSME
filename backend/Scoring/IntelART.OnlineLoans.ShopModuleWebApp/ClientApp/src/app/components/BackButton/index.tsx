import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import history from '../../../browserHistory'

interface IBackButtonProps {
  back?: string;
}

const BackButton: React.FC<IBackButtonProps> = props => {
  const { state } = history.location

  const goBack = () => {
    if (props.back) {
      history.push(props.back)
    } else {
      state && state.from ? history.push(state.from) : history.push('/')
    }
  }
  return (
    <Button variant="outline-primary" onClick={goBack}>
      <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
      Վերադարձ
    </Button>
  )
}

export default BackButton
