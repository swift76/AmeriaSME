import * as yup from 'yup'

import { Utils } from 'app/services/utils'

const { localizedClientErrors } = Utils
const requiredError = localizedClientErrors('REQUIRED')

export const getValidationScheme = (
  minDay: number = 1,
  maxDay: number = 30
) => {
  return yup.object().shape({
    FINAL_AMOUNT: yup
      .number()
      .nullable()
      .required(requiredError)
      .test('length', requiredError, val => val && val > 1),

    REPAYMENT_DAY: yup
      .string()
      .nullable()
      .required(requiredError)
      .test(
        'length',
        localizedClientErrors('REPAYMENT_DAY')
          .replace('{minDay}', String(minDay))
          .replace('{maxDay}', String(maxDay)),
        val => val <= maxDay && minDay <= val
      ),
  })
}
