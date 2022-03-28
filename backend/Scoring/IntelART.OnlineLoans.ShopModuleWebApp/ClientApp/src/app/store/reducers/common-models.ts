export interface ISelectDataReceive {
    readonly DESCRIPTION?: string
    readonly CODE: string;
    readonly NAME: string;
 }

 export interface IGetRequestError {
    readonly Data: string | null;
    readonly ErrorCode: string | null;
    readonly Inner: string | null;
    readonly Message: string;
    readonly StackTrace: string;
}

export interface IOverheadsData {
    CODE: string,
    NAME?: string,
    PRODUCTS: IOverHeadsProducs[]
  }

export interface IOverHeadsProducs {
    NAME?: string,
    INDUSTRY_PRODUCT_NAME: string,
    INDUSTRY_CODE?: string,
    INDUSTRY_PRODUCT_CODE: string,
    NET_AMOUNT: number,
    SALE_AMOUNT: number,
    PRODUCT_PERCENTAGE: number
}
export interface IAppCompanyData {
    NAME?: string,
    CODE: string
    AMOUNT: number
    COMMENT: string
}

export interface IAppRelatedPersons {
    NAME: string;
    DOCUMENT_NUMBER: string
}


export interface IDocument {
    APPLICATION_ID: string | null,
    ID: number | null
    APPLICATION_SCAN_TYPE_CODE: string | null,
    FILE_NAME: string | null
    CREATION_DATE: string | null
  }