import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { getSelectedOrganisation, getSupplierIds, getUsername } from '../../../reducers';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { TextInput } from './../../../form/TextInput';
import { SubmitButton } from '../../../form/SubmitButton';
import { CancelButton } from '../../../form/CancelButton';
import { useForm, Values } from '../../../form/useForm';
import { minLength } from '../../../form/validators';
import { addNotification } from '../../../actions';
import { convertToSelectObject } from '../../../utils/convertToSelectObject';
import formStyles from './../../../styles/Forms.module.css';
import timeseriesIcon from "../../../images/timeseries_icon.svg";
import { AccessModifier } from '../../../form/AccessModifier';
import { SelectDropdown } from '../../../form/SelectDropdown';

interface Props {
  currentTimeseries?: any
};

const backUrl = "/data_management/timeseries/timeseries";

const TimeseriesForm = (props: Props & DispatchProps & RouteComponentProps) => {
  const { currentTimeseries } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const username = useSelector(getUsername);
  const supplierIds = useSelector(getSupplierIds).available;

  const initialValues = currentTimeseries ? {
    name: currentTimeseries.name,
    code: currentTimeseries.code,
    accessModifier: currentTimeseries.access_modifier,
    supplier: currentTimeseries.supplier ? convertToSelectObject(currentTimeseries.supplier) : null,
    supplierCode: currentTimeseries.supplier_code,
  } : {
    name: null,
    code: null,
    accessModifier: 'Private',
    supplier: convertToSelectObject(username),
    supplierCode: null
  };

  const onSubmit = (values: Values) => {
    console.log(values);

    const body = {
      name: values.name,
      code: values.code,
      access_modifier: values.accessModifier,
      supplier: values.supplier.value,
      supplier_code: values.supplierCode,
    };

    if (!currentTimeseries) {
      fetch("/api/v4/timeseries/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(response => {
        const status = response.status;
        if (status === 201) {
          props.addNotification('Success! New time-series created', 2000);
          props.history.push(backUrl);
        } else if (status === 403) {
          props.addNotification("Not authorized", 2000);
          console.error(response);
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        };
      })
      .catch(console.error);
    } else {
      fetch(`/api/v4/timeseries/${currentTimeseries.uuid}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(response => {
        const status = response.status;
        if (status === 200) {
          props.addNotification('Success! Time-series updated', 2000);
          props.history.push(backUrl);
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        }
      })
      .catch(console.error);
    };
  };

  const {
    values,
    triedToSubmit,
    // formSubmitted,
    tryToSubmitForm,
    handleInputChange,
    handleValueChange,
    handleSubmit,
    handleReset,
    clearInput,
    fieldOnFocus,
    // handleBlur,
    // handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={timeseriesIcon}
      imgAltDescription={"Timeseries icon"}
      headerText={"Timeseries"}
      // explanationText={lableTypeFormHelpText[fieldOnFocus] || lableTypeFormHelpText['default']}
      explanationText={"Timeseries is for now read only"}
      backUrl={backUrl}
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
          placeholder={'Please enter at least 3 characters'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Code *'}
          name={'code'}
          placeholder={'Please enter at least 1 character'}
          value={values.code}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.code)}
          errorMessage={minLength(1, values.code)}
          triedToSubmit={triedToSubmit}
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <AccessModifier
          title={'Accessibility'}
          name={'accessModifier'}
          value={values.accessModifier}
          valueChanged={value => handleValueChange('accessModifier', value)}
          readOnly={!!currentTimeseries}
        />
        <SelectDropdown
          title={'Username of supplier'}
          name={'supplier'}
          placeholder={'- Search and select -'}
          value={values.supplier}
          valueChanged={value => handleValueChange('supplier', value)}
          options={supplierIds.map((suppl: any) => convertToSelectObject(suppl.username))}
          validated
          readOnly={!(supplierIds.length > 0 && selectedOrganisation.roles.includes('admin'))}
          dropUp
        />
        <TextInput
          title={'Supplier code'}
          name={'supplierCode'}
          value={values.supplierCode}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly={!selectedOrganisation.roles.includes('admin')}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={backUrl}
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