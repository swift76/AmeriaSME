import { ISelectDataReceive } from 'app/store/reducers/common-models';
import { IStoreDocuments } from 'app/store/reducers/documents/initialState';
import { PHOTOS_MIN_COUNT } from 'app/constants';
import React from 'react'
import _ from 'lodash'
import { getCompanyMultipleOwners } from 'app/api/Application'
import localization from 'app/locale/hy/global.json'

interface Iob {
  id: string;
  [key: string]: any;
}

interface IformatParams {
  pattern?: RegExp,
  replace?: RegExp | string
}

interface Ilocalization {
  [key: string]: any;
}

export class Utils {
  public static generateGUID(): string {
    function S4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    return S4() + S4()
  }

  public static findById(o: Iob, id: string): Iob | undefined {
    if (o.id === id) {
      return o
    }
    let result
    let p: string
    for (p in o) {
      if (o.hasOwnProperty(p) && typeof o[p] === 'object') {
        result = this.findById(o[p], id)
        if (result) {
          return result
        }
      }
    }
    return result
  }

  public static localizedServerErrors(key: string): string {
    return (localization as Ilocalization).serverErrors[key] || key || 'ինչ-որ բան սխալ է'
  }

  public static localizedClientErrors(key: string): string {
    return (localization as Ilocalization).clientErrors[key] || key || 'ինչ-որ բան սխալ է'
  }

  public static formatInputValue(handleChange: any, params: IformatParams) {
    return (event: React.ChangeEvent<any>): void | boolean => {
      const  { target } = event
      if (params.pattern && !params.pattern.test(String(target.value))) {
        return false
      }
      if (params.replace) {
        target.value = target.value.replace(params.replace, '')
      }
      handleChange(event)
    }
  }

  public static getNameByCode = (code: string, arr: ISelectDataReceive[]): string => {
    const obj = _.find(
      arr,
      o => o.CODE === code
    )
    return _.result(obj, 'NAME') || ''
  }

  public static formatAsCurrency = (amount: number) => {
    return amount.toLocaleString();
  }

  public static arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const image = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    )
    return image
  }

  public static getApprovedModalOptions = async (id: string) => {
    return getCompanyMultipleOwners(id).then(preApprove => {
      const { TITLE_TXT, CONTENT_TXT } = localization.modalTxt
      const {LOAN_APPROVED} = CONTENT_TXT
      const approvedType = preApprove ? 'կանխահաստատվել' : 'հաստատվել'
      const title = TITLE_TXT.APPROVAL_TITLE.replace('{X}', approvedType)
      const children = LOAN_APPROVED.replace( '{X}',
        approvedType
      )
      return {
        children,
        title,
      }
    })
  }

  public static checkDocumentIsUploaded = (docType: string, documents: IStoreDocuments) => {
    const doc = _.find(documents.data, { APPLICATION_SCAN_TYPE_CODE: docType })
    return !!doc
  }

  public static checkPhotosIsUploaded = (pledge: boolean, pledgeCount: number, nonPledgeCount: number) => {
    return pledge ?
      pledgeCount >= PHOTOS_MIN_COUNT && nonPledgeCount >= PHOTOS_MIN_COUNT
    : nonPledgeCount >= PHOTOS_MIN_COUNT
  }

  public static bytesToSize = (bytes: number) => {
    const sizes = ['Բայթ', 'կիլոբայթ', 'Մեգաբայթ', 'Գիգաբայթ', 'Տեռաբայթ'];
    if (bytes === 0) {
      return '0 Byte'
    };
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))), 10);
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }
}