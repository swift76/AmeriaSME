import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ReducerState } from 'AppTypes'
import { Utils } from '../services/utils'
import { getCurrencies } from 'app/api/Directory'

export const useCurrencyName = (code: string, loanTypeCode: string) => {
  const [currencyName, setCurrencyName] = useState('')
  const dispatch = useDispatch()
  const currencies = useSelector(
    (store: ReducerState) => store.directory.currencies
  )

  useEffect(() => {
    if (currencies.data[loanTypeCode]) {
      const name = Utils.getNameByCode(code, currencies.data[loanTypeCode])
      setCurrencyName(name)
    }
  }, [code, loanTypeCode, currencies])

  useEffect(() => {
    if (loanTypeCode && !currencies.data[loanTypeCode]) {
      dispatch(getCurrencies(loanTypeCode))
    }
  }, [loanTypeCode])

  return currencyName
}
