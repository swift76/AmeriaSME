import * as yup from 'yup';

import CancelModalContainer, {
    ICancelModalProps
} from 'app/containers/componentContainers/CancelModalContainer';
import { Form, Spinner } from 'react-bootstrap';
import React, { useEffect } from 'react';

import { Formik } from 'formik';
import { ICanceledPUTData } from 'app/api/Application/termination';
import clsx from 'clsx';

const Component: React.FC<ICancelModalProps> = props => {
    const { getCancelReasons, cancelReasons, cancelApplicaton, closeModal, history, id } = props;

    useEffect(() => {
        !cancelReasons.data.length && getCancelReasons();
    }, []);

    const onValidSubmit = (values: ICanceledPUTData) => {
        cancelApplicaton(id, { ...values }).then(() => {
            closeModal();
            history.push('/');
        });
    };

    const validationSchema = yup.object({
        CANCELLATION_REASON_CODE: yup.string().required('Խնդրում ենք ընտրել մերժման պատճառը')
    });

    return (
        <div className="cancel-modal-content">
            <Formik
                initialValues={{ CANCELLATION_REASON_CODE: '' }}
                onSubmit={onValidSubmit}
                validationSchema={validationSchema}
            >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                    <>
                        <p
                            className={clsx({
                                'text-danger': errors.CANCELLATION_REASON_CODE,
                                'text-default': !errors.CANCELLATION_REASON_CODE
                            })}
                        >
                            Ընտրել մերժման պատճառը
                        </p>
                        <hr></hr>
                        {cancelReasons.cancelReasonsIsLoading ? (
                            <div className="modal-content-loader">
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="mr-1"
                                    variant="primary"
                                />
                            </div>
                        ) : (
                            <Form
                                className="loan-form"
                                noValidate={true}
                                onSubmit={handleSubmit}
                                id="cancelForm"
                            >
                                <Form.Group controlId="formCancelRadios">
                                    {cancelReasons.data.map(reason => (
                                        <Form.Check
                                            required={true}
                                            key={reason.CODE}
                                            type="radio"
                                            label={reason.NAME}
                                            name="CANCELLATION_REASON_CODE"
                                            id={`currency${reason.CODE}`}
                                            checked={
                                                values.CANCELLATION_REASON_CODE === reason.CODE
                                            }
                                            value={reason.CODE}
                                            onChange={handleChange}
                                            isInvalid={
                                                touched.CANCELLATION_REASON_CODE &&
                                                !!errors.CANCELLATION_REASON_CODE
                                            }
                                            className="loan-form-checkbox"
                                        />
                                    ))}
                                </Form.Group>
                            </Form>
                        )}
                    </>
                )}
            </Formik>
        </div>
    );
};

const CancelModalContent = CancelModalContainer(Component);

export default CancelModalContent;
