import { application } from './application'
import { applications } from './applications'
import { combineReducers } from 'redux'
import { companyPhotos } from './companyPhotos'
import directory from './directory'
import { documents } from './documents'
import loanAppGroupData from './loanAppGroupData'
import { loanLimits } from './loanLimits'
import { loanParameters } from './loanParameters'
import { loanSettings } from './loanSettings'
import { loanSpecApplication } from './loanSpecApplication'
import { mainApplication } from './mainApplication'
import { preapprovedResults } from './preapprovedResults'
import { scoringResults } from './scoringResults'
import settings from './settings'
import { user } from './user'

const rootReducers = combineReducers({
  user,
  applications,
  application,
  loanSpecApplication,
  mainApplication,
  scoringResults,
  loanSettings,
  loanParameters,
  loanLimits,
  directory,
  loanAppGroupData,
  settings,
  companyPhotos,
  preapprovedResults,
  documents,
})

export default rootReducers
