import React from 'react';
import {  useSelector } from "react-redux";
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { TextInput } from './../form/TextInput';
import { CheckBox } from './../form/CheckBox';
import { CancelButton } from '../form/CancelButton';
import { useForm, Values } from '../form/useForm';
import { minLength } from '../form/validators';
import { getContractForSelectedOrganisation, getUsage } from '../reducers';
import { helpTextContractView } from '../utils/help_texts/helpTextContractView';
import formStyles from './../styles/Forms.module.css';
import agreementIcon from "../images/agreement.svg";
import { TextArea } from './../form/TextArea';
import UsagePieChart from './../components/UsagePieChart';



export const ContractForm = () => {

  const contractObjApi = useSelector(getContractForSelectedOrganisation);
  const usageObj = useSelector(getUsage);

  const initialValues = {
  };

  const onSubmit = (values: Values) => {};

  const {
    values,
    triedToSubmit,
    handleValueChange,
    handleInputChange,
    fieldOnFocus,
    handleFocus,
    handleBlur,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={agreementIcon}
      imgAltDescription={"Contract Icon"}
      headerText={"Contract"}
      explanationText={helpTextContractView[fieldOnFocus] || helpTextContractView['default']}
      backUrl={"/management"}
      fieldName={fieldOnFocus}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <span className={`${formStyles.FormFieldTitle} ${formStyles.FirstFormFieldTitle}`}>
          1: General
        </span>
        <TextInput
          title={'Start date contract'}
          name={'start_date_contract'}
          value={(new Date(contractObjApi.start).toLocaleDateString())}
          valueChanged={handleInputChange}
          validated
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
        <span className={formStyles.FormFieldTitle}>
          2. Data
        </span>
        <div 
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              marginRight: "100px"
            }}
          >
            <div className={formStyles.LabelTitle} >Rasters</div>
            <UsagePieChart
              used={usageObj.raster_total_size}
              available={contractObjApi.raster_storage_capacity}
            />
          </div>
          <div
            style={{
              marginRight: "100px"
            }}
          >
            <div className={formStyles.LabelTitle}>Scenarios</div>
            <UsagePieChart
              used={usageObj.scenario_total_size}
              available={contractObjApi.scenario_storage_capacity}
            />
          </div>
          <div>
            <div className={formStyles.LabelTitle}>Timeseries</div>
            <UsagePieChart
              used={usageObj.timeseries_total_size}
              available={contractObjApi.timeseries_storage_capacity}
            />
          </div>
        </div>
        <span className={formStyles.FormFieldTitle}>
          3. Other
        </span>
        <TextInput
          title={'Assets capacity'}
          name={'asset_capacity'}
          value={contractObjApi.asset_capacity}
          valueChanged={handleInputChange}
          validated
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
        <TextInput
          title={'Labels capacity'}
          name={'label_capacity'}
          value={contractObjApi.label_capacity}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(2, values.name)}
          errorMessage={minLength(2, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
        <TextInput
          title={'Events capacity'}
          name={'event_capacity'}
          value={contractObjApi.event_capacity}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(2, values.name)}
          errorMessage={minLength(2, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
        <TextInput
          title={'Alarm message capacity'}
          name={'alarm_message_capacity'}
          value={contractObjApi.alarm_message_capacity}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(2, values.name)}
          errorMessage={minLength(2, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
        <CheckBox
          title={'Geoblocks functionality'}
          name={'geoblocks_functionality'}
          value={contractObjApi.geoblocks_acces}
          valueChanged={bool => handleValueChange('scopeWildcardReadWrite', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
          validated={true}
          errorMessage={false}
        />
        <TextInput
          title={'Geoblocks calculation units'}
          name={'geoblocks_calculation_units'}
          value={contractObjApi.geoblocks_calculation_units_capacity}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(2, values.name)}
          errorMessage={minLength(2, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
        <TextArea
          title={'Links'}
          name={'links'}
          placeholder={'This is a layer based on raster_source'}
          value={contractObjApi.links}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
          readOnly={true}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/management'}
            buttonText={"CLOSE"}
          />
          
        </div>
      </form>
    </ExplainSideColumn>
  );
};