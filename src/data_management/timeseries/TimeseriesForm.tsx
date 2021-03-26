import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { getSelectedOrganisation, getUsername } from '../../reducers';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { addNotification } from '../../actions';
import { convertToSelectObject } from '../../utils/convertToSelectObject';
import formStyles from './../../styles/Forms.module.css';
import timeseriesIcon from "../../images/timeseries_icon.svg";

interface Props {
  currentTimeseries?: any
};

const TimeseriesForm = (props: Props & DispatchProps & RouteComponentProps) => {
  const { currentTimeseries } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const username = useSelector(getUsername);

  const initialValues = currentTimeseries ? {
    name: currentTimeseries.name || '',
    description: currentTimeseries.description || '',
    organisation: currentTimeseries.organisation ? convertToSelectObject(currentTimeseries.organisation.uuid.replace(/-/g, ""), currentTimeseries.organisation.name) : null,
    supplier: currentTimeseries.username || '',
  } : {
    name: null,
    description: null,
    organisation: selectedOrganisation ? convertToSelectObject(selectedOrganisation.uuid.replace(/-/g, ""), selectedOrganisation.name) : null,
    supplier: username || '',
  };

  const onSubmit = (values: Values) => {
    console.log(values);
  };

  // const onDelete = () => {
  //   const body = {};

  //   fetch(`/api/v4/timeseries/${currentTimeseries.uuid}/`, {
  //     credentials: 'same-origin',
  //     method: 'DELETE',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify(body)
  //   })
  //     .then(data => {
  //       const status = data.status;
  //       if (status === 204) {
  //         props.addNotification('Success! Timeseries deleted', 2000);
  //         props.history.push('/data_management/timeseries/timeseries/');
  //       } else {
  //         props.addNotification(status, 2000);
  //         console.error(data);
  //       };
  //     })
  //     .catch(console.error);
  // }

  const {
    values,
    triedToSubmit,
    // formSubmitted,
    tryToSubmitForm,
    handleInputChange,
    handleSubmit,
    handleReset,
    clearInput,
    fieldOnFocus,
    handleBlur,
    handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={timeseriesIcon}
      imgAltDescription={"Timeseries icon"}
      headerText={"Timeseries"}
      // explanationText={lableTypeFormHelpText[fieldOnFocus] || lableTypeFormHelpText['default']}
      explanationText={"Timeseries is for now read only"}
      backUrl={"/data_management/timeseries/timeseries"}
      fieldName={fieldOnFocus}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <span className={formStyles.FormFieldTitle}>
          1: General
        </span>
        <TextInput
          title={'Name *'}
          name={'name'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/data_management/timeseries/timeseries'}
          />
          <SubmitButton
            onClick={tryToSubmitForm}
          />
        </div>
      </form>
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapPropsToDispatch>;

export default connect(null, mapPropsToDispatch)(withRouter(TimeseriesForm));