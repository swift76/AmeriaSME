import {IDocument} from '../common-models'

const initialState: IStoreDocuments = {
  isLoading: false,
  isLoaded: false,
  isFail: false,
  data: [],
}

export default initialState

export interface IStoreDocuments {
  readonly isLoading: boolean;
  readonly isLoaded: boolean;
  readonly isFail: boolean;
  readonly data: IDocument[];
}
