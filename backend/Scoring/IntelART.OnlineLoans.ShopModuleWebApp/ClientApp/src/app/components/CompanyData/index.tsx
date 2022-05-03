// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { FieldArray, FormikProps, getIn } from 'formik';
import React, { useEffect, useState } from 'react';
import { faPencilAlt, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import AddNoteModalContent from '../Modals/addNoteContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IAdditionalTableRow } from './models';
import { IAppCompanyData } from 'app/store/reducers/common-models';
import { ILoanSpecApplicationData } from 'app/store/reducers/loanSpecApplication/models';
import NumberFormat from 'react-number-format';
import { ReducerState } from 'AppTypes';
import { Utils } from 'app/services/utils';
import _ from 'lodash';
import clsx from 'clsx';
import { modals } from 'app/store/reducers/settings/actions';

interface IAppCompanyDataProps extends FormikProps<ILoanSpecApplicationData> {
    title?: string;
    sectionName: string;
    showTotal?: boolean;
    dataName: string;
    editable?: boolean | undefined;
    amountPrefix?: string | undefined;
    loading?: boolean;
    readonly?: false;
    sync?: string[];
    maxRowCount?: number;
}

const AppCompanyData: React.FC<IAppCompanyDataProps> = props => {
    const [total, setTotal] = useState(0);
    const [activeRowId, setActiveRowId] = useState<string | null>();
    const [isEditables, setIsEditables] = useState<any>({});
    const [canAddRow, setCanAddRow] = useState(false);
    const dispatch = useDispatch();
    const industryTypes = useSelector(
        ({ loanAppGroupData }: ReducerState) => loanAppGroupData.industryTypes
    );

    const modal = useSelector((store: ReducerState) => store.settings.modal);

    const {
        sectionName,
        title,
        showTotal,
        dataName,
        values,
        handleChange,
        touched,
        errors,
        editable,
        amountPrefix = 'դրամ',
        loading,
        children,
        setFieldValue,
        sync,
        maxRowCount
    } = props;

    const data: IAppCompanyData[] = values[dataName];

    useEffect(() => {
        showTotal && setTotal(_.sumBy(data, d => Number(d.AMOUNT)));
    }, [data, showTotal]);

    useEffect(() => {
        if (editable) {
            if (maxRowCount) {
                setCanAddRow(maxRowCount > data.length);
            } else {
                setCanAddRow(industryTypes.data.length > data.length);
            }
        }
    }, [data.length, maxRowCount, industryTypes.data.length]);

    useEffect(() => {
        !modal.state && setActiveRowId(null);
    }, [modal.state]);

    const enableFormControl = (fieldName: string) => (e: React.SyntheticEvent<any>) => {
        setIsEditables({
            ...isEditables,
            [fieldName]: !isEditables[fieldName]
        });
    };
    const showNoteModal = (comment: string, action: any, rowName: string) => (
        e: React.SyntheticEvent<any>
    ) => {
        setActiveRowId(rowName);
        dispatch(
            modals.openModal({
                title: 'Ավելացնել մեկնաբանություն',
                children: (
                    <AddNoteModalContent
                        comment={comment}
                        onSubmit={({ COMMENT }) => {
                            action(COMMENT);
                            dispatch(modals.closeModal());
                        }}
                    />
                ),
                footer: (
                    <Button variant="primary" form="addNewCommentForm" type="submit">
                        Հաստատել
                    </Button>
                )
            })
        );
    };

    const handleChangeSyncFields = (
        e: React.SyntheticEvent<any>,
        syncFields: string[],
        index: number
    ) => {
        const { value } = e.currentTarget;
        syncFields.forEach(arrName => {
            setFieldValue(arrName, [
                ...values[arrName].map((obj: any, i: number) => {
                    if (index === i) {
                        obj.CODE = value;
                    }
                    return obj;
                })
            ]);
        });
    };

    const setArrayFieldComment = (index: number, row: IAppCompanyData, action: any) => (
        nCom: string
    ) => action(index, { ...row, ...{ COMMENT: nCom } });

    const setFieldComment = (name: string, action: any) => (nCom: string) => action(name, nCom);

    const addNewRow = (push: (obj: any) => void) => (e: React.SyntheticEvent<any>) => {
        const newIndex = data.length;
        const newCodeName = `${dataName}.${newIndex}.CODE`;
        const emptyRow = { CODE: '', AMOUNT: 0, COMMENT: '' };
        push(emptyRow);
        setIsEditables({
            ...isEditables,
            [newCodeName]: true
        });
        if (sync) {
            sync.forEach(arrName => {
                setFieldValue(arrName, [...values[arrName], emptyRow]);
            });
        }
    };
    const removeRow = (index: number, remove: (index: number) => void) => (
        e: React.SyntheticEvent<any>
    ) => {
        remove(index);
        if (sync) {
            sync.forEach(arrName => {
                setFieldValue(
                    arrName,
                    values[arrName].filter((value: any, i: number) => i !== index)
                );
            });
        }
    };

    const isFieldDisabled = (name: string) => !isEditables[name];
    const getError = (name: string) => getIn(errors, name);
    const getTouched = (name: string) => getIn(touched, name);

    return (
        <div className={`adv-loan-section`} id={sectionName}>
            <h5 className="adv-loan-title">{title}</h5>
            <Table striped={true} borderless={true} className="adv-loan-table">
                {showTotal && (
                    <thead>
                        <tr className="bg-gray">
                            <th>Ընդհանուր</th>
                            <th colSpan={3}>{Utils.formatAsCurrency(total)}</th>
                        </tr>
                    </thead>
                )}
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="text-center">
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="mr-1"
                                    variant="primary"
                                />
                            </td>
                        </tr>
                    ) : (
                        <React.Fragment>
                            <FieldArray
                                name={dataName}
                                render={arrayHelpers => (
                                    <div>
                                        {data.length ? (
                                            <React.Fragment>
                                                {data.map((row, index) => {
                                                    const rowName = `${dataName}.row.${index}`;
                                                    const amountName = `${dataName}.${index}.AMOUNT`;
                                                    const codeName = `${dataName}.${index}.CODE`;
                                                    return (
                                                        <tr
                                                            key={rowName}
                                                            className={clsx({
                                                                active: activeRowId === rowName
                                                            })}
                                                        >
                                                            <td className="name-col">
                                                                {editable ? (
                                                                    <Form.Group
                                                                        controlId={codeName}
                                                                    >
                                                                        <Form.Control
                                                                            as="select"
                                                                            name={codeName}
                                                                            value={
                                                                                data[index].CODE ||
                                                                                ''
                                                                            }
                                                                            onChange={e => {
                                                                                handleChange(e);
                                                                                sync &&
                                                                                    handleChangeSyncFields(
                                                                                        e,
                                                                                        sync,
                                                                                        index
                                                                                    );
                                                                            }}
                                                                            className="control-200"
                                                                            isValid={
                                                                                getTouched(
                                                                                    codeName
                                                                                ) &&
                                                                                !getError(codeName)
                                                                            }
                                                                            isInvalid={
                                                                                getTouched(
                                                                                    codeName
                                                                                ) &&
                                                                                !!getError(codeName)
                                                                            }
                                                                            disabled={isFieldDisabled(
                                                                                codeName
                                                                            )}
                                                                            plaintext={isFieldDisabled(
                                                                                codeName
                                                                            )}
                                                                        >
                                                                            <option value="">
                                                                                Ընտրել
                                                                            </option>
                                                                            {industryTypes.data
                                                                                .filter(
                                                                                    industry =>
                                                                                        data[index]
                                                                                            .CODE ===
                                                                                            industry.CODE ||
                                                                                        !data.find(
                                                                                            dd =>
                                                                                                dd.CODE ===
                                                                                                industry.CODE
                                                                                        )
                                                                                )
                                                                                .map(industry => (
                                                                                    <option
                                                                                        key={
                                                                                            industry.CODE
                                                                                        }
                                                                                        value={
                                                                                            industry.CODE
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            industry.NAME
                                                                                        }
                                                                                    </option>
                                                                                ))}
                                                                        </Form.Control>
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {getError(codeName)}
                                                                        </Form.Control.Feedback>
                                                                        <Button
                                                                            className="btn-transparent"
                                                                            variant="link"
                                                                            onClick={enableFormControl(
                                                                                codeName
                                                                            )}
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faPencilAlt}
                                                                                className="mr-1 text-primary"
                                                                            />
                                                                        </Button>
                                                                    </Form.Group>
                                                                ) : (
                                                                    row.NAME ||
                                                                    Utils.getNameByCode(
                                                                        row.CODE,
                                                                        industryTypes.data
                                                                    )
                                                                )}
                                                            </td>

                                                            <td>
                                                                <Form.Group controlId={'name'}>
                                                                    <NumberFormat
                                                                        allowNegative={false}
                                                                        thousandSeparator={true}
                                                                        isNumericString={true}
                                                                        name={amountName}
                                                                        value={String(
                                                                            data[index].AMOUNT
                                                                        )}
                                                                        customInput={Form.Control}
                                                                        onFocus={() => {
                                                                            data[index].AMOUNT ===
                                                                                0 &&
                                                                                setFieldValue(
                                                                                    amountName,
                                                                                    ''
                                                                                );
                                                                        }}
                                                                        onValueChange={val => {
                                                                            setFieldValue(
                                                                                amountName,
                                                                                val.value
                                                                            );
                                                                        }}
                                                                        className={clsx(
                                                                            'control-100',
                                                                            {
                                                                                'is-valid':
                                                                                    getTouched(
                                                                                        amountName
                                                                                    ) &&
                                                                                    !getError(
                                                                                        amountName
                                                                                    ),
                                                                                'is-invalid':
                                                                                    getTouched(
                                                                                        amountName
                                                                                    ) &&
                                                                                    !!getError(
                                                                                        amountName
                                                                                    )
                                                                            }
                                                                        )}
                                                                    />

                                                                    <span className="form-label col-form-label ml-1">
                                                                        {amountPrefix}
                                                                    </span>
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {getError(amountName)}
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                            </td>

                                                            <td>
                                                                <Button
                                                                    variant="link"
                                                                    className="add-comment"
                                                                    onClick={showNoteModal(
                                                                        row.COMMENT,
                                                                        setArrayFieldComment(
                                                                            index,
                                                                            row,
                                                                            arrayHelpers.replace
                                                                        ),
                                                                        rowName
                                                                    )}
                                                                >
                                                                    {!!row.COMMENT
                                                                        ? row.COMMENT
                                                                        : `Ավելացնել մեկնաբանություն`}
                                                                </Button>
                                                            </td>

                                                            <td>
                                                                {editable && (
                                                                    <Button
                                                                        variant="link"
                                                                        className="p-0"
                                                                        onClick={removeRow(
                                                                            index,
                                                                            arrayHelpers.remove
                                                                        )}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faTrashAlt}
                                                                            className="mr-1 text-danger"
                                                                        />
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                    >{`Չկա ավելացված ${title}ի տեսակ`}</td>
                                                </tr>
                                                {touched[dataName] && errors[dataName] && (
                                                    <tr>
                                                        <td colSpan={4}>
                                                            <p className="text-danger mb-0">
                                                                {errors[dataName]}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        )}

                                        {canAddRow && (
                                            <tr className="bg-transparent">
                                                <td colSpan={4}>
                                                    <Button
                                                        variant="link"
                                                        className="p-0"
                                                        onClick={addNewRow(arrayHelpers.push)}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPlus}
                                                            className="mr-1 text-primary"
                                                        />
                                                        {`Ավելացնել`}
                                                    </Button>
                                                </td>
                                            </tr>
                                        )}
                                    </div>
                                )}
                            />
                        </React.Fragment>
                    )}
                </tbody>
                {children && (
                    <tbody>
                        {(children as IAdditionalTableRow[]).map(row => {
                            const { fileName, name, noteFieldName, radio } = row;
                            const val = values[fileName];
                            const commentVal = values[noteFieldName];
                            return (
                                <tr
                                    key={fileName}
                                    className={clsx('bg-transparent', {
                                        active: activeRowId === fileName
                                    })}
                                >
                                    <td className="name">{name}</td>
                                    <td>
                                        {radio && (
                                            <>
                                                <Form.Check
                                                    inline={true}
                                                    name={fileName}
                                                    value="true"
                                                    label="Այո"
                                                    type="radio"
                                                    checked={!!val}
                                                    onChange={() => setFieldValue(fileName, true)}
                                                />
                                                <Form.Check
                                                    inline={true}
                                                    name={fileName}
                                                    value="false"
                                                    checked={!val}
                                                    label="Ոչ"
                                                    type="radio"
                                                    onChange={() => setFieldValue(fileName, false)}
                                                />
                                            </>
                                        )}
                                    </td>
                                    <td colSpan={2}>
                                        <Button
                                            variant="link"
                                            className="add-comment"
                                            onClick={showNoteModal(
                                                commentVal,
                                                setFieldComment(noteFieldName, setFieldValue),
                                                fileName
                                            )}
                                        >
                                            {!!commentVal
                                                ? commentVal
                                                : `Ավելացնել մեկնաբանություն`}
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                )}
            </Table>
        </div>
    );
};

export default AppCompanyData;
