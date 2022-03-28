import { activities } from './activities'
import { addresses } from './addresses'
import { appraisalCompanies } from './appraisalCompanies'
import { businessStateTypes } from './businessStateTypes'
import { cancelReasons } from './cancellationReasons'
import { combineReducers } from 'redux'
import { currencies } from './currencies'
import { facutalIndustires } from './factualIndustries'
import { insuranceCompanies } from './insuranceCompanies'
import { loanTypes } from './loanTypes'
import { pledgeTypes } from './pledgeTypes'

const directory = combineReducers({
  facutalIndustires,
  loanTypes,
  pledgeTypes,
  cancelReasons,
  currencies,
  addresses,
  activities,
  appraisalCompanies,
  businessStateTypes,
  insuranceCompanies,
})

export default directory
