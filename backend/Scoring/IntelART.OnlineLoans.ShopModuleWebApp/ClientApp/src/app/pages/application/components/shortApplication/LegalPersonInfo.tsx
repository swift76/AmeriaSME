import { Col, Form, Row } from 'react-bootstrap';

import { FormikProps } from 'formik';
import { IApplicationData } from 'app/store/reducers/application/models';
import { IStoreActivities } from 'app/store/reducers/directory/activities/initialState';
import React from 'react';
import { Utils } from 'app/services/utils';

export interface ILoanBaseFieldsProps extends FormikProps<IApplicationData> {
    title?: string;
    activities: IStoreActivities;
}

const LoanBaseFields: React.FC<ILoanBaseFieldsProps> = React.memo(props => {
    const { activities, values, touched, errors, handleChange } = props;
    return (
        <fieldset className="loan-form-group">
            <legend>{props.title}</legend>
            <Form.Group controlId="FIRST_NAME_EN" as={Row}>
                <Form.Label column={true} sm={5}>
                    Անուն (անգլերեն)
                </Form.Label>
                <Col sm={7}>
                    <Form.Control
                        type="text"
                        name="FIRST_NAME_EN"
                        value={values.FIRST_NAME_EN}
                        isValid={touched.FIRST_NAME_EN && !errors.FIRST_NAME_EN}
                        isInvalid={touched.FIRST_NAME_EN && !!errors.FIRST_NAME_EN}
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.FIRST_NAME_EN}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group controlId="LAST_NAME_EN" as={Row}>
                <Form.Label column={true} sm={5}>
                    Ազգանուն (անգլերեն)
                </Form.Label>
                <Col sm={7}>
                    <Form.Control
                        type="text"
                        name="LAST_NAME_EN"
                        value={values.LAST_NAME_EN}
                        isValid={touched.LAST_NAME_EN && !errors.LAST_NAME_EN}
                        isInvalid={touched.LAST_NAME_EN && !!errors.LAST_NAME_EN}
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.LAST_NAME_EN}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group controlId="ACTIVITY_CODE" as={Row}>
                <Form.Label column={true} sm={5}>
                    Գործունեության ոլորտ
                </Form.Label>
                <Col sm={7}>
                    <Form.Control
                        as="select"
                        name="ACTIVITY_CODE"
                        value={values.ACTIVITY_CODE}
                        isValid={touched.ACTIVITY_CODE && !errors.ACTIVITY_CODE}
                        isInvalid={touched.ACTIVITY_CODE && !!errors.ACTIVITY_CODE}
                        onChange={handleChange}
                    >
                        <option value="">Ընտրել</option>
                        {activities.data.length &&
                            activities.data.map(activity => (
                                <option key={activity.CODE} value={activity.CODE}>
                                    {activity.NAME}
                                </option>
                            ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.ACTIVITY_CODE}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group controlId="SOCIAL_CARD_NUMBER" as={Row}>
                <Form.Label column={true} sm={5}>
                    ՀԾՀՀ / սոցիալական քարտի համար
                </Form.Label>
                <Col sm={7}>
                    <Form.Control
                        name="SOCIAL_CARD_NUMBER"
                        value={values.SOCIAL_CARD_NUMBER}
                        isValid={touched.SOCIAL_CARD_NUMBER && !errors.SOCIAL_CARD_NUMBER}
                        isInvalid={touched.SOCIAL_CARD_NUMBER && !!errors.SOCIAL_CARD_NUMBER}
                        maxLength={10}
                        onChange={Utils.formatInputValue(handleChange, {
                            pattern: /^(0|[0-9][0-9]*)$/
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.SOCIAL_CARD_NUMBER}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
        </fieldset>
    );
});

export default LoanBaseFields;
