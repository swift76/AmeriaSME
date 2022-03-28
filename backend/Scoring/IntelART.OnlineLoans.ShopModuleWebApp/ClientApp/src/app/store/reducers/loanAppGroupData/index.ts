import { badMonthEarnings } from './badMonthEarnings'
import { balances } from './balances'
import { combineReducers } from 'redux'
import { goodMonthEarnings } from './goodMonthEarnings'
import { guarantors } from './guarantors'
import { industryProducts } from './industryProducts'
import { industryTypes } from './industryTypes'
import { nonOpExpenses } from './nonOpExpenses'
import { opExpenses } from './opExpenses'
import { otherStatistics } from './otherStatistics'
import { overheads } from './overheads'
import { pledgers } from './pledgers'
import { profits } from './profits'

const loanAppGroupData = combineReducers({
  profits,
  overheads,
  industryTypes,
  opExpenses,
  nonOpExpenses,
  balances,
  guarantors,
  pledgers,
  otherStatistics,
  goodMonthEarnings,
  badMonthEarnings,
  industryProducts,
})

export default loanAppGroupData
