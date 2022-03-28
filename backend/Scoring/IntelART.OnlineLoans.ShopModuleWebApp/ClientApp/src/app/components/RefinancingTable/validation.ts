import * as yup from 'yup'

import { Utils } from 'app/services/utils'

const { localizedClientErrors } = Utils
const requiredError = localizedClientErrors('REQUIRED')

export const validationSchema = yup.object().shape({
  loans: yup.array().of(
    yup.object().shape({
      LOAN_CODE: yup
        .string()
        .nullable()
        .required(requiredError)
        .test(
          'loanCode',
          localizedClientErrors('LOAN_CODE_FORMAT_ERROR'),
          val => {
            const regexp = /^\d{3}\S{9}[L-Z]\d{3}$/
            return regexp.test(val)
          }
        ),
    })
  ),
})
