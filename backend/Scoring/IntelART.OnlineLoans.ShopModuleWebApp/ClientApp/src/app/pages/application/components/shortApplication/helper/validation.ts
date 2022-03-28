import * as yup from 'yup'

import { Utils } from 'app/services/utils'

const { localizedClientErrors } = Utils
const requiredError = localizedClientErrors('REQUIRED')

yup.setLocale({
  string: {
    email: 'Էլ․ հասցեի ֆորմատը սխալ է',
    // default: 'Պարտադիր լրացման դաշտ',
    url: 'Հղումը սխալ է',
  },
})

const conditionalRequired = {
  is: false,
  then: yup.string().required(requiredError),
}

export const validationSchema = yup.object({
  TAX_ID_NUMBER: yup
    .string()
    .nullable()
    .required(requiredError)
    .test(
      'length',
      localizedClientErrors('TAXID_NUMBER'),
      val => val && val.length === 8
    ),

  COMPANY_NAME: yup
    .string()
    .nullable()
    .required(requiredError),

  FACTUAL_INDUSTRY_CODE: yup
    .string()
    .nullable()
    .required(requiredError),

  ANNUAL_TURNOVER: yup
    .number()
    .nullable()
    .required(requiredError)
    .test(
      'length',
      localizedClientErrors('ANNUAL_TURNOVER'),
      val => val && val > 1
    ),

  MOBILE_PHONE: yup
    .string()
    .nullable()
    .required(requiredError)
    .test('phoneNumber', localizedClientErrors('MOBILE_PHONE'), val => {
      const regexp = /^([+]\d{3})?\s?(\d{2}\s?)(\d{2}\s?){2}\d{2}$/g
      return regexp.test(val)
    }),

  COMPANY_EMAIL: yup
    .string()
    .nullable()
    .required(requiredError)
    .email(),

  WEBSITE: yup
    .string()
    .nullable()
    .matches(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i,
      'Հղումը սխալ է'
    ),

  FACEBOOK: yup
    .string()
    .nullable()
    .matches(
      /(?:(?:http|https):\/\/)?(?:www.)?m.facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/i,
      'ֆեյսբուկի Հղումը սխալ է'
    ),

  LOAN_TYPE_ID: yup
    .number()
    .nullable()
    .required(requiredError),
  CURRENCY_CODE: yup
    .string()
    .nullable()
    .required(requiredError),

  INITIAL_AMOUNT: yup
    .number()
    .nullable()
    .required(requiredError)
    .test(
      'length',
      localizedClientErrors('INITIAL_AMOUNT'),
      val => val && val > 1
    ),
  CURRENT_COUNTRY_CODE: yup
    .string()
    .when('IS_CURRENT_ADDRESS_SAME', conditionalRequired),
  CURRENT_STATE_CODE: yup
    .string()
    .when('IS_CURRENT_ADDRESS_SAME', conditionalRequired),
  CURRENT_CITY_CODE: yup
    .string()
    .when('IS_CURRENT_ADDRESS_SAME', conditionalRequired),
  CURRENT_STREET: yup
    .string()
    .when('IS_CURRENT_ADDRESS_SAME', conditionalRequired),
  CURRENT_BUILDNUM: yup
    .string()
    .when('IS_CURRENT_ADDRESS_SAME', conditionalRequired),
  // CURRENT_APARTMENT: yup
  //   .string()
  //   .when('IS_CURRENT_ADDRESS_SAME', conditionalRequired),

  INDIVIDUAL_COUNTRY_CODE: yup
    .string()
    .when('IS_INDIVIDUAL_ADDRESS_SAME', conditionalRequired),
  INDIVIDUAL_STATE_CODE: yup
    .string()
    .when('IS_INDIVIDUAL_ADDRESS_SAME', conditionalRequired),
  INDIVIDUAL_CITY_CODE: yup
    .string()
    .when('IS_INDIVIDUAL_ADDRESS_SAME', conditionalRequired),
  INDIVIDUAL_STREET: yup
    .string()
    .when('IS_INDIVIDUAL_ADDRESS_SAME', conditionalRequired),
  INDIVIDUAL_BUILDNUM: yup
    .string()
    .when('IS_INDIVIDUAL_ADDRESS_SAME', conditionalRequired),
  // INDIVIDUAL_APARTMENT: yup
  //   .string()
  //   .when('IS_INDIVIDUAL_ADDRESS_SAME', conditionalRequired),

  FIRST_NAME_EN: yup
    .string()
    .nullable()
    .required(requiredError),

  LAST_NAME_EN: yup
    .string()
    .nullable()
    .required(requiredError),
  ACTIVITY_CODE: yup
    .string()
    .nullable()
    .required(requiredError),
  SOCIAL_CARD_NUMBER: yup
    .string()
    .nullable()
    .required(requiredError)
    .test(
      'length',
      localizedClientErrors('SOCIAL_CARD_NUMBER'),
      val => val && val.length === 10
    ),
})
