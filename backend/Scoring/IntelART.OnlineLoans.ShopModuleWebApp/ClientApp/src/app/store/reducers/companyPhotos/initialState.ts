import { ILoanPhotos } from './models'

const initialState: IStoreCompanyPhotos = {
  isLoading: false,
  isLoaded: false,
  isFail: false,
  pledgeCount: 0,
  nonPledgeCount: 0,
  data: [],
}

export default initialState

export interface IStoreCompanyPhotos {
  isLoading: boolean;
  isLoaded: boolean;
  isFail: boolean;
  pledgeCount: number
  nonPledgeCount: number
  readonly data: ILoanPhotos[];
}
