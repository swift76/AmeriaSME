import { Form, FormControlProps } from 'react-bootstrap'

import { ISelectDataReceive } from '@store/reducers/common-models'
import React from 'react'

export interface ISelectProps extends FormControlProps {
    name: string
    options: ISelectDataReceive[];
}

const Dropdown: React.FC<ISelectProps> = (props: ISelectProps) => {
  const { name, options, disabled, readOnly, plaintext } = props
  return (
    <Form.Control as="select" name={name} disabled={disabled} readOnly={readOnly} plaintext={plaintext}>
      {options.map(option => (
        <option value={option.CODE} key={option.CODE}>
          {option.NAME}
        </option>
      ))}
    </Form.Control>
  )
}

export default Dropdown
