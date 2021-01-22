import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, /*useSelector*/ } from 'react-redux';
// import { getOrganisations, getUsername } from '../reducers';
// import { ScenarioResult } from '../form/ScenarioResult';
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { TextInput } from './../form/TextInput';
import { SubmitButton } from '../form/SubmitButton';
import { CancelButton } from '../form/CancelButton';
import { useForm, Values } from '../form/useForm';
// import { minLength } from '../form/validators';
import { addNotification } from '../actions';
import personalApiKeysIcon from "../images/personal_api_key_icon.svg";
import formStyles from './../styles/Forms.module.css';
import { personalApiKeysFormHelpText } from '../utils/helpTextForForms';

interface Props {
  currentRecord: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};
interface RouteParams {
  uuid: string;
};

const PersonalApiKeyFormModel: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (props) => {
  const { currentRecord } = props;
  // const organisations = useSelector(getOrganisations).available;
  // const scenarioOrganisation = organisations.find((org: any) => org.uuid === currentRecord.organisation.uuid.replace(/-/g, ""));
  // const username = useSelector(getUsername);

  const initialValues = {
    name: currentRecord.name || '',
    // modelName: currentRecord.model_name || '',
    // supplier: currentRecord.username || '',
    // organisation: currentRecord.organisation.name || '',
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name
    };

    fetch(`/api/v4/personalapikeys/`, {
      credentials: 'same-origin',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(data => {
        const status = data.status;
        if (status === 200) {
          props.addNotification('Success! Personal API key generated', 2000);
          // props.history.push('/data_management/scenarios/');
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
    // formSubmitted,
    tryToSubmitForm,
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
      imgUrl={personalApiKeysIcon}
      imgAltDescription={"Personal API keys icon"}
      headerText={"Label types"}
      explanationText={personalApiKeysFormHelpText[fieldOnFocus] || personalApiKeysFormHelpText['default']}
      // explanationText={"Personal API keys can be used to authenticate external applications in Lizard"} 
      backUrl={"/personal_api_keys"}
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
          title={'name'}
          name={'name'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          errorMessage={false}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={currentRecord}
        />
        {/* <TextInput
          title={'Based on model'}
          name={'modelName'}
          value={values.modelName}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        /> */}
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/personal_api_keys'}
          />
          {!currentRecord?
          <SubmitButton
            onClick={tryToSubmitForm}
          />
          :null}
        </div>
      </form>
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

const PersonalApiKeyForm = connect(null, mapPropsToDispatch)(withRouter(PersonalApiKeyFormModel));

export { PersonalApiKeyForm };