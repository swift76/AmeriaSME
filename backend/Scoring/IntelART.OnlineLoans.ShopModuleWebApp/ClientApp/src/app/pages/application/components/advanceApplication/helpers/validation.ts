import * as yup from 'yup'

import { IGetLoanLimitsDataReceive } from 'app/store/reducers/loanLimits/models'
import { Utils } from 'app/services/utils'
import _ from 'lodash'

const { localizedClientErrors } = Utils
const requiredError = localizedClientErrors('REQUIRED')
const greaterThen0 = localizedClientErrors('NUMBER_GREATEN_THAN_0')

const companyDataShape = yup.array().of(
  yup.object().shape({
    CODE: yup
      .string()
      .nullable()
      .required(requiredError),
    AMOUNT: yup
      .string()
      .nullable()
      .required(requiredError),
  })
)

const relatedPersons = yup.array().of(
  yup.object().shape({
    NAME: yup
      .string()
      .nullable()
      .required(requiredError),
    DOCUMENT_NUMBER: yup
      .string()
      .nullable()
      .required(requiredError)
      .test('length', 'ՀԾՀ/ՀՎՀՀ -ն պետք է լինի առնվազն 8 նիշ', val => {
        if (val && val.length < 8) {
          return false
        }
        return true
      })
      .test('length', 'ՀԾՀ/ՀՎՀՀ -ն կարող է լինի առավելագույնը 10 նիշ', val => {
        if (val && val.length > 10) {
          return false
        }
        return true
      }),
  })
)

export const getValidationScheme = (
  minDay: number = 1,
  maxDay: number = 30,
  pledgeIsShow: boolean = false,
  loanLimits: IGetLoanLimitsDataReceive
) => {
  let pledgeReq = {}
  const mainReqFields = {
    LS_LOAN_TYPE_ID: yup
      .number()
      .nullable()
      .required(requiredError),

    LS_CURRENCY_CODE: yup
      .string()
      .nullable()
      .required(requiredError),

    LS_LOAN_AMOUNT: yup
      .string()
      .nullable()
      .required(requiredError)
      .test(
        'length',
        params => {
          let errName
          let num
          if (Number(params.value) > loanLimits.FROM_AMOUNT) {
            errName = 'NUMBER_MAX_EXCEEDS_ERROR'
            num = Number(loanLimits.TO_AMOUNT)
          } else {
            errName = 'NUMBER_MIN_EXCEEDS_ERROR'
            num = Number(loanLimits.FROM_AMOUNT)
          }

          return `${localizedClientErrors(errName)} ${Utils.formatAsCurrency(
            num
          )}`
        },
        val => val <= loanLimits.TO_AMOUNT && loanLimits.FROM_AMOUNT <= val
      ),

    LS_LOAN_TERM: yup
      .string()
      .nullable()
      .required(requiredError),

    LS_REPAYMENT_DAY: yup
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

    BUSINESS_SPACE: yup
      .number()
      .nullable()
      .required(requiredError)
      .test('length', greaterThen0, val => val && val > 0),

    EMPLOYEE_COUNT: yup
      .number()
      .nullable()
      .required(requiredError)
      .test('length', greaterThen0, val => val && val > 0),

    FAMILY_MEMBER_COUNT: yup
      .number()
      .nullable()
      .required(requiredError)
      .test('length', greaterThen0, val => val && val > 0),

    VEHICLE_COUNT: yup
      .number()
      .nullable()
      .required(requiredError),

    BUSINESS_STATE_CODE: yup
      .string()
      .nullable()
      .required(requiredError),

    PROFITS: companyDataShape.min(
      1,
      'Խնդրում ենք ավելացնել հասույթի առնվազն մեկ տեսակ'
    ),

    OPERATIONAL_EXPENSES: companyDataShape,
    NONOPERATIONAL_EXPENSES: companyDataShape,
    BALANCES: companyDataShape,
    GOOD_MONTH_EARNINGS: companyDataShape,
    BAD_MONTH_EARNINGS: companyDataShape,
    OTHER_STATISTICS: companyDataShape,
    GUARANTORS: relatedPersons.min(1, 'Խնդրում ենք ավելացնել երաշխավոր'),
    OVERHEADS: yup.array().of(
      yup.object().shape({
        CODE: yup
          .string()
          .nullable()
          .required(requiredError),
        PRODUCT_PERCENTAGE_TOTAL: yup
          .string()
          // tslint:disable-next-line: only-arrow-functions
          .test('length', 'Հանրագումարը պետք է կազմի 100', function(val) {
            const { PRODUCTS } = this.parent
            if (PRODUCTS.length) {
              const totalPercent = _.sumBy(PRODUCTS, (d: any) =>
                Number(d.PRODUCT_PERCENTAGE)
              )
              return totalPercent === 0 || totalPercent === 100
            }
            return true
          }),
        PRODUCTS: yup.array().of(
          yup.object().shape({
            NET_AMOUNT: yup
              .string()
              .nullable()
              .required(requiredError)
              .test('depends-req', requiredError, function(val) {
                const { SALE_AMOUNT, PRODUCT_PERCENTAGE } = this.parent
                if (Number(SALE_AMOUNT) || Number(PRODUCT_PERCENTAGE)) {
                  return Boolean(Number(val))
                }
                return true
              }),
            SALE_AMOUNT: yup
              .string()
              .nullable()
              .required(requiredError)
              .test('depends-req', requiredError, function(val) {
                const { NET_AMOUNT, PRODUCT_PERCENTAGE } = this.parent
                if (Number(NET_AMOUNT) || Number(PRODUCT_PERCENTAGE)) {
                  return Boolean(Number(val))
                }
                return true
              })
              .test(
                'depends-req',
                'Վաճառքի գինը պետք է մեծ լինի ինքնարժեքից',
                function(val) {
                  const { NET_AMOUNT } = this.parent
                  if (Number(NET_AMOUNT) > Number(val)) {
                    return false
                  }
                  return true
                }
              ),

            PRODUCT_PERCENTAGE: yup
              .string()
              .nullable()
              .required(requiredError)
              .test('depends-req', requiredError, function(val) {
                const { NET_AMOUNT, SALE_AMOUNT } = this.parent
                if (Number(NET_AMOUNT) || Number(SALE_AMOUNT)) {
                  return Boolean(Number(val))
                }
                return true
              }),
          })
        ),
      })
    ),
  }
  if (pledgeIsShow) {
    pledgeReq = {
      PLEDGERS: relatedPersons.min(1, 'Խնդրում ենք ավելացնել գրավատու'),
      INSURANCE_COMPANY_CODE: yup
        .string()
        .nullable()
        .when('IS_INSURANCE_CONDITION', {
          is: true,
          then: yup
            .string()
            .nullable()
            .required(requiredError),
        }),
      MARKET_PRICE: yup
        .number()
        .nullable()
        .nullable()
        .required(requiredError)
        .test('length', greaterThen0, val => val && val > 0),

      LIQUID_PRICE: yup
        .number()
        .nullable()
        .nullable()
        .required(requiredError)
        .test('length', greaterThen0, val => val && val > 0),

      VEHICLE_MODEL: yup
        .string()
        .nullable()
        .when('IS_REAL_ESTATE', {
          is: false,
          then: yup
            .string()
            .nullable()
            .required(requiredError),
        }),

      VEHICLE_VIN: yup
        .string()
        .nullable()
        .when('IS_REAL_ESTATE', {
          is: false,
          then: yup
            .string()
            .nullable()
            .required(requiredError),
        }),

      VEHICLE_DATE: yup
        .string()
        .nullable()
        .when('IS_REAL_ESTATE', {
          is: false,
          then: yup
            .string()
            .nullable()
            .required(requiredError),
        }),

      ESTATE_ADDRESS: yup
        .string()
        .nullable()
        .when('IS_REAL_ESTATE', {
          is: true,
          then: yup
            .string()
            .nullable()
            .required(requiredError),
        }),

      ESTATE_RESIDENTIAL_AREA: yup
        .number()
        .nullable()
        .when('IS_REAL_ESTATE', {
          is: true,
          then: yup.number().when('ESTATE_LAND_AREA', {
            is: val => !val,
            then: yup
              .number()
              .required(requiredError)
              .test('length', greaterThen0, val => val && val > 0),
          }),
        }),

      ESTATE_LAND_AREA: yup
        .number()
        .nullable()
        .when('IS_REAL_ESTATE', {
          is: true,
          then: yup.number().when('ESTATE_RESIDENTIAL_AREA', {
            is: val => !val,
            then: yup
              .number()
              .required(requiredError)
              .test('length', greaterThen0, val => val && val > 0),
          }),
        }),

      IS_REAL_ESTATE: yup
        .boolean()
        .nullable()
        .required(requiredError),

      OWNERSHIP_CERTIFICATE_DATE: yup
        .string()
        .nullable()
        .required(requiredError),

      OWNERSHIP_CERTIFICATE_NUMBER: yup
        .string()
        .nullable()
        .required(requiredError),

      APPRAISAL_COMPANY_CODE: yup
        .string()
        .nullable()
        .required(requiredError),

      APPRAISAL_DATE: yup
        .string()
        .nullable()
        .required(requiredError),

      C01: yup
        .boolean()
        .nullable()
        .test('length', requiredError, val => val === true),

      A01: yup
        .boolean()
        .nullable()
        .test('length', requiredError, val => val === true),
    }
  }

  return yup.object().shape({ ...mainReqFields, ...pledgeReq })
}
