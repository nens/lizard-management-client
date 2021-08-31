import React from 'react';
import {  useSelector } from "react-redux";
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { TextInput } from './../form/TextInput';
import { CheckBox } from './../form/CheckBox';
import { LinksArea } from '../form/LinksArea';
import { CancelButton } from '../form/CancelButton';
import { useForm, Values } from '../form/useForm';
import { getContractForSelectedOrganisation, getUsage } from '../reducers';
import { helpTextContractView } from '../utils/help_texts/helpTextContractView';
import formStyles from './../styles/Forms.module.css';
import agreementIcon from "../images/agreement.svg";
import UsagePieChart from './../components/UsagePieChart';



export const ContractForm = () => {

  const contractObjApi = useSelector(getContractForSelectedOrganisation);
  const usageObj = useSelector(getUsage);

  const initialValues = {
  };

  const onSubmit = (values: Values) => {};

  const {
    handleValueChange,
    handleInputChange,
    fieldOnFocus,
    handleFocus,
    handleBlur,
    handleSubmit,
    handleReset,
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        />
        <TextInput
          title={'Labels capacity'}
          name={'label_capacity'}
          value={contractObjApi.label_capacity}
          valueChanged={handleInputChange}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        />
        <TextInput
          title={'Events capacity'}
          name={'event_capacity'}
          value={contractObjApi.event_capacity}
          valueChanged={handleInputChange}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        />
        <TextInput
          title={'Alarm message capacity'}
          name={'alarm_message_capacity'}
          value={contractObjApi.alarm_message_capacity}
          valueChanged={handleInputChange}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        />
        <CheckBox
          title={'Geoblocks functionality'}
          name={'geoblocks_functionality'}
          value={contractObjApi.geoblocks_acces}
          valueChanged={bool => handleValueChange('scopeWildcardReadWrite', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
          validated
        />
        <TextInput
          title={'Geoblocks calculation units'}
          name={'geoblocks_calculation_units'}
          value={contractObjApi.geoblocks_calculation_units_capacity}
          valueChanged={handleInputChange}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        />
        <LinksArea
          title={'Links'}
          name={'link'}
          links={contractObjApi.links || []}
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