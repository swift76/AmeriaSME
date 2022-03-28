import { Button, Spinner } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { deleteDocument, saveDocument } from '@app/api/Documents'
import {
  faLink,
  faPlusCircle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface IDocumentUploaderProps {
  id: string;
  documentType: string;
  openNewTab?: boolean;
  hasDoc?: boolean;
  setFieldValue: any;
}

const DocumentUploader: React.FC<IDocumentUploaderProps> = props => {
  const { id, documentType, openNewTab = true } = props
  const [hasDoc, setHasDoc] = useState(props.hasDoc)
  const [docLoading, setDocLoading] = useState(false)

  useEffect(() => {
    setHasDoc(props.hasDoc)
  }, [props.hasDoc])

  useEffect(() => {
    props.setFieldValue(documentType, hasDoc)
  }, [hasDoc])

  const getDocumentUrl = () =>
    '/api/loan/Applications/' + id + '/Documents/' + documentType

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target && e.target.files && e.target.files[0]

    const data = new FormData()
    if (file) {
      setDocLoading(true)
      data.append('file', file)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = async () => {
        saveDocument(id, documentType, data)
          .then(response => {
            setHasDoc(true)
          })
          .finally(() => {
            setDocLoading(false)
          })
      }
    }
  }

  const handleRemoveDocument = (e: React.SyntheticEvent<any>) => {
    setDocLoading(true)
    deleteDocument(id, documentType)
      .then(() => {
        setHasDoc(false)
      })
      .finally(() => {
        setDocLoading(false)
      })
  }

  return (
    <div className="document-uploader">
      <div className="document-action">
        {docLoading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mr-1"
            variant="primary"
          />
        ) : hasDoc ? (
          <>
            {openNewTab && (
              <a
                className="btn btn-link btn-sm"
                href={getDocumentUrl()}
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faLink}
                  className="text-primary"
                  size={'1x'}
                />
              </a>
            )}
            <Button variant="link" size="sm" onClick={handleRemoveDocument}>
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="text-danger"
                size={'1x'}
              />
            </Button>
          </>
        ) : (
          <>
            <Button variant="link" size="sm">
              <FontAwesomeIcon
                icon={faPlusCircle}
                className="text-primary"
                size={'1x'}
              />
            </Button>
            <input
              type="file"
              accept={`application/pdf, image/*`}
              onChange={handleImageChange}
              className="file-uploader"
            ></input>
          </>
        )}
      </div>
    </div>
  )
}

export default DocumentUploader
