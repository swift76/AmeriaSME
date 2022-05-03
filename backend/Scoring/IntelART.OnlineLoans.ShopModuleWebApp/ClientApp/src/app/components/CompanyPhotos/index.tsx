import React, { useEffect, useState } from 'react'
import {
  setPhotosCount,
  setNewPhoto,
  removePhoto,
} from 'app/store/reducers/companyPhotos/actions'
import { useDispatch, useSelector } from 'react-redux'

import { ILoanPhotos } from 'app/store/reducers/companyPhotos/models'
import PhotoUploader from '../PhotoUploader'
import { ReducerState } from 'AppTypes'
import _ from 'lodash'
import { PHOTOS_MIN_COUNT as minCount, PHOTOS_MAX_COUNT as maxCount } from 'app/constants'

export interface ICompanyPhotos {
  id: string;
  pledge: boolean;
  fileMaxSize: number
}

const CompanyPhotos: React.FC<ICompanyPhotos> = props => {
  const { id, pledge, fileMaxSize } = props
  const [photos, setPhotos] = useState<ILoanPhotos[]>([])
  const companyPhotos = useSelector(
    (store: ReducerState) => store.companyPhotos
  )
  const dispatch = useDispatch()

  const getSinglePhotoObj = (isPledge: boolean) => {
    return {
      APPLICATION_ID: null,
      APPLICATION_SCAN_TYPE_CODE: null,
      CREATION_DATE: null,
      FILE_NAME: null,
      ID: null,
      IS_PLEDGE: isPledge,
    }
  }

  useEffect(() => {
    if (companyPhotos.isLoaded) {
      const savedPhotos = companyPhotos.data.filter(
        photo => photo.IS_PLEDGE === pledge
      )
      const savedCount = savedPhotos.length


      const count = savedCount < minCount ? minCount : savedCount === maxCount ? savedCount : savedPhotos.length + 1

      setPhotos(
        new Array(count)
          .fill(getSinglePhotoObj(pledge))
          .map((photo, index) =>
            savedPhotos[index] ? savedPhotos[index] : photo
          )
      )
    }
  }, [pledge, companyPhotos.isLoaded])

  useEffect(() => {
    return () => {
      setPhotos([])
    }
  }, [])

  useEffect(() => {
    dispatch(setPhotosCount(getUploadedCount(), pledge))
  }, [photos])

  const addUploder = (newPhotos: ILoanPhotos[]) => {
    if (!_.filter(newPhotos, ['ID', null]).length && newPhotos.length < maxCount) {
      setPhotos([...newPhotos, getSinglePhotoObj(pledge)])
    }
  }

  const onUpload = (photoId: number, index: number) => {
    const newPhotos = [
      ...photos.slice(0, index),
      Object.assign({}, photos[index], { ID: photoId }),
      ...photos.slice(index + 1),
    ]

    setPhotos(newPhotos)

    dispatch(setNewPhoto({ ...getSinglePhotoObj(pledge), ID: photoId }))

    addUploder(newPhotos)
  }



  const onRemove = (photoId: number, index: number) => {
    let newPhotos = []
    if (photos.length > minCount) {
      newPhotos = [...photos]
      newPhotos.splice(index, 1)
    } else {
      newPhotos = [
        ...photos.slice(0, index),
        Object.assign({}, photos[index], getSinglePhotoObj(pledge)),
        ...photos.slice(index + 1),
      ]
    }
    setPhotos([...newPhotos])
    dispatch(removePhoto(photoId))

    addUploder(newPhotos)
  }

  const getUploadedCount = () => _.reject(photos, ['ID', null]).length

  return (
    <div className="company-photos">
      <h4 className="w-100 mb-3">
        {pledge ? `Գրավի լուսանկարներ` : `Բիզնեսի լուսանկարներ`}
      </h4>
      {photos.map((photo, index) => (
        <PhotoUploader
          key={index}
          index={index}
          fileMaxSize={fileMaxSize}
          {...photo}
          applicationId={id}
          onUpload={onUpload}
          onRemove={onRemove}
        ></PhotoUploader>
      ))}
      {getUploadedCount() < minCount && (
        <p className="text-danger">{`Առնվազն ${minCount} լուսանկար պարտադիր Է`}</p>
      )}
    </div>
  )
}

export default CompanyPhotos
