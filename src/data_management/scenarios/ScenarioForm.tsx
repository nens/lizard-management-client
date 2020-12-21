import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { getOrganisations, getUsername } from '../../reducers';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { addFilesToQueue, addNotification } from '../../actions';
import rasterSourceIcon from "../../images/raster_source_icon.svg";
import formStyles from './../../styles/Forms.module.css';

interface Props {
  currentScenario: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void,
  addFilesToQueue: (files: File[]) => void,
};
interface RouteParams {
  uuid: string;
};

const ScenarioFormModel: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (props) => {
  const { currentScenario } = props;
  const organisations = useSelector(getOrganisations).available;
  const scenarioOrganisation = organisations.find((org: any) => org.uuid === currentScenario.organisation.uuid.replace(/-/g, ""));
  const username = useSelector(getUsername);

  const initialValues = {
    name: currentScenario.name || '',
    modelName: currentScenario.model_name || '',
    supplier: currentScenario.username || '',
    organisation: currentScenario.organisation.name || '',
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name
    };
    console.log('submitted', body);

    fetch(`/api/v4/scenarios/${currentScenario.uuid}/`, {
      credentials: 'same-origin',
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(data => {
        const status = data.status;
        if (status === 200) {
          props.addNotification('Success! Scenario updated', 2000);
          props.history.push('/data_management/scenarios/');
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
    tryToSubmitForm,
    handleInputChange,
    // handleValueChange,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={rasterSourceIcon}
      imgAltDescription={"Raster-Source icon"}
      headerText={"Scenarios"}
      explainationText={"Edit a 3Di scenario."}
      backUrl={"/data_management/scenarios/"}
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
          title={'Scenario name'}
          name={'name'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
          readOnly={!scenarioOrganisation.roles.includes("admin") && !(username === currentScenario.username)}
        />
        <TextInput
          title={'Based on model'}
          name={'modelName'}
          value={values.modelName}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <TextInput
          title={'Organisation'}
          name={'organisation'}
          value={values.organisation}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly
        />
        <TextInput
          title={'Username of supplier'}
          name={'supplier'}
          value={values.supplier}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/data_management/scenarios/'}
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
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
  addFilesToQueue: (files: File[]) => dispatch(addFilesToQueue(files)),
});

const ScenarioForm = connect(null, mapPropsToDispatch)(withRouter(ScenarioFormModel));

export { ScenarioForm };