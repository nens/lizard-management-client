import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { getOrganisations,  getUsername } from '../../reducers';
import { ScenarioResult } from '../../form/ScenarioResult';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
import { AccessModifier } from '../../form/AccessModifier';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { addNotification } from '../../actions';
import threediIcon from "../../images/3di@3x.svg";
import formStyles from './../../styles/Forms.module.css';
import { scenarioFormHelpText, DefaultScenarioExplanationText } from '../../utils/help_texts/helpTextForScenarios';

interface Props {
  currentRecord: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};
interface RouteParams {
  uuid: string;
};

const ScenarioFormModel: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (props) => {
  const { currentRecord } = props;
  const organisations = useSelector(getOrganisations).available;
  const scenarioOrganisation = organisations.find((org: any) => org.uuid === currentRecord.organisation.uuid);
  const username = useSelector(getUsername);

  const initialValues = {
    name: currentRecord.name,
    uuid: currentRecord.uuid,
    modelName: currentRecord.model_name || '',
    supplier: currentRecord.username || '',
    organisation: currentRecord.organisation.name || '',
    accessModifier: currentRecord.access_modifier
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      access_modifier: values.accessModifier
    };

    fetch(`/api/v4/scenarios/${currentRecord.uuid}/`, {
      credentials: 'same-origin',
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(data => {
        const status = data.status;
        if (status === 200) {
          props.addNotification('Success! Scenario updated', 2000);
          props.history.push('/management/data_management/scenarios/');
        } else {
          props.addNotification(status, 2000);
          console.error(data);
        };
      })
      .catch(console.error);
  };

  const {
    values,
    triedToSubmit,
    formSubmitted,
    tryToSubmitForm,
    handleInputChange,
    handleValueChange,
    fieldOnFocus,
    handleFocus,
    handleBlur,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={threediIcon}
      imgAltDescription={"3Di icon"}
      headerText={"3Di Scenarios"}
      explanationText={
        scenarioFormHelpText[fieldOnFocus] || 
        DefaultScenarioExplanationText()
      }
      backUrl={"/management/data_management/scenarios/"}
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
          title={'Scenario name *'}
          name={'name'}
          placeholder={'Please enter at least 3 characters'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={!scenarioOrganisation.roles.includes("admin") && !(username === currentRecord.username)}
        />
        {currentRecord ? (
          <TextInput
            title={'UUID'}
            name={'uuid'}
            value={values.uuid}
            valueChanged={handleInputChange}
            validated
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly
          />
        ) : null}
        <TextInput
          title={'Based on model'}
          name={'modelName'}
          value={values.modelName}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <ScenarioResult
          name={'results'}
          uuid={currentRecord.uuid}
          formSubmitted={formSubmitted}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <AccessModifier
          title={'Accessibility *'}
          name={'accessModifier'}
          value={values.accessModifier}
          valueChanged={value => handleValueChange('accessModifier', value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Organisation *'}
          name={'organisation'}
          value={values.organisation}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        />
        <TextInput
          title={'Username of supplier'}
          name={'supplier'}
          value={values.supplier}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/management/data_management/scenarios/'}
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

const ScenarioForm = connect(null, mapPropsToDispatch)(withRouter(ScenarioFormModel));

export { ScenarioForm };