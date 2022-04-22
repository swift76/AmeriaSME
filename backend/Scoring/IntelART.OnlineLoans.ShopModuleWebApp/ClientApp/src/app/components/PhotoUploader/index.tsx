import { Button, Spinner } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import {
  faHeartBroken,
  faPlusCircle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ILoanPhotos } from 'app/store/reducers/companyPhotos/models'
import { Utils } from 'app/services/utils'
import axios from 'app/api'
import clsx from 'clsx'
import { toast } from 'react-toastify'

export interface IPhotoUploaderProps extends ILoanPhotos {
  applicationId: string;
  index: number;
  onUpload: (id: number, index: number) => void
  onRemove: (id: number, index: number) => void
  fileMaxSize: number
}

const PhotoUploader: React.FC<IPhotoUploaderProps> = props => {
  const { ID, IS_PLEDGE, applicationId, fileMaxSize } = props
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const sizeViolations = (file: File): boolean => {
    return Math.round(file.size) > fileMaxSize
  }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target && e.target.files && e.target.files[0]
    if (file) {
      if (sizeViolations(file)) {
        toast.error(`Ֆայլի չափը չպետք է գերազանցի ${Utils.bytesToSize(fileMaxSize)}ը`)
        setError(true)
        setTimeout(() => {
          setError(false)
        }, 1000);
      } else {
        setLoading(true)
        const data = new FormData()
        data.append('file', file)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
          const newPhoto = await axios.put(
            `/Applications/${applicationId}/Photos`,
            data,
            {
              params: {
                isPledge: IS_PLEDGE,
              },
            }
          )
          newPhoto.data && props.onUpload(newPhoto.data, props.index)
        }
      }
    }
  }

  const handleImageLoaded = () => setLoading(false)
  const handleImageErrored = () => {
    setLoading(false)
    setError(true)
  }

  const handleImageRemove = async (e: React.SyntheticEvent<any>) => {
    await axios.delete(`/Applications/${ID}/Photos`)
    ID && props.onRemove(ID, props.index)
  }

  const FileInput = () => (
    <input
      type="file"
      accept={`image/x-png,image/gif,image/jpeg`}
      onChange={handleImageChange}
      className="file-uploader"
    ></input>
  )

  useEffect(() => {
    if (ID) {
      axios
        .get(`/Applications/${ID}/Photos/${applicationId}`, {
          responseType: 'arraybuffer',
        })
        .then(({ headers, data }) => {
          const header = `${headers['content-type'].toLowerCase()}`
          setUrl(`data:${header};base64,${Utils.arrayBufferToBase64(data)}`)
        })
    } else {
      !!url && setUrl("")
    }
  }, [ID])

  return (
    <div className="uploader">
      {url && (
        <img
          className="photo"
          src={url}
          onLoad={handleImageLoaded}
          onError={handleImageErrored}
        />
      )}
      <div
        className={clsx('upload-action-wrap', {
          show: loading || !url || error,
        })}
      >
        {loading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mr-1"
            variant="primary"
          />
        ) : error ? (
          <FontAwesomeIcon
            icon={faHeartBroken}
            className="text-danger"
            size={'1x'}
          />
        ) : !url ? (
          <Button variant="link" size="sm">
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="text-primary"
              size={'1x'}
            />
            <FileInput />
          </Button>
        ) : (
          <Button variant="link" size="sm" onClick={handleImageRemove}>
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="text-danger"
              size={'1x'}
            />
          </Button>
        )}
      </div>
    </div>
  )
}

export default PhotoUploader
