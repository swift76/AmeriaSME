import { IAppCompanyData } from '@store/reducers/common-models'
import _ from 'lodash'

export const updateCompanyData = (data: IAppCompanyData[]) => {
  return _.each(data, (val, key) => {
    if (!val.COMMENT) {
      val.COMMENT = ''
    }
  })
}
