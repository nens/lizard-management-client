import { RouteComponentProps, withRouter } from "react-router";
import { connect, useSelector } from "react-redux";
import { AppDispatch } from "../../..";
import { getOrganisations, getSelectedOrganisation } from "../../../reducers";
import { ScenarioResult } from "../../../form/ScenarioResult";
import { ExplainSideColumn } from "../../../components/ExplainSideColumn";
import { TextInput } from "./../../../form/TextInput";
import { TextArea } from "../../../form/TextArea";
import { AccessModifier } from "../../../form/AccessModifier";
import { SubmitButton } from "../../../form/SubmitButton";
import { CancelButton } from "../../../form/CancelButton";
import { useForm, Values } from "../../../form/useForm";
import { jsonValidator, minLength } from "../../../form/validators";
import { SelectDropdown } from "../../../form/SelectDropdown";
import { addNotification } from "../../../actions";
import { scenarioFormHelpText } from "../../../utils/help_texts/helpTextForScenarios";
import { convertToSelectObject } from "../../../utils/convertToSelectObject";
import { Scenario } from "../../../types/scenarioType";
import { Project } from "../../../types/projectType";
import threediIcon from "../../../images/3di@3x.svg";
import formStyles from "./../../../styles/Forms.module.css";

interface Props {
  currentRecord: Scenario;
}
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void;
}
interface RouteParams {
  uuid: string;
}

// Helper function to fetch paginated projects with search query
export const fetchProjects = async (searchQuery: string, organisationUuid: string) => {
  const urlQuery = searchQuery ? `?name__icontains=${searchQuery}&organisation__uuid=${organisationUuid}` : `?organisation__uuid=${organisationUuid}`;
  const response = await fetch(`/api/v4/projects/${urlQuery}`);
  const responseJSON = await response.json();

  return responseJSON.results.map((project: Project) => convertToSelectObject(project.uuid, project.name));
};

const navigationUrl = "/management/data_management/scenarios/scenarios";

const ScenarioForm: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (
  props
) => {
  const { currentRecord } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const organisations = useSelector(getOrganisations).available;
  const organisationsToSwitchTo = organisations.filter((org) => org.roles.includes("admin"));

  const initialValues = {
    name: currentRecord.name,
    uuid: currentRecord.uuid,
    description: currentRecord.description,
    source: currentRecord.source,
    project: currentRecord.project ? convertToSelectObject(currentRecord.project) : null,
    simulationStart: currentRecord.simulation_start,
    simulationEnd: currentRecord.simulation_end,
    simulationIdentifier: currentRecord.simulation_identifier,
    modelName: currentRecord.model_name,
    modelIdentifier: currentRecord.model_identifier,
    modelRevision: currentRecord.model_revision,
    organisation: currentRecord.organisation ? convertToSelectObject(currentRecord.organisation.uuid, currentRecord.organisation.name) : null,
    accessModifier: currentRecord.access_modifier,
    extraMetadata: JSON.stringify(currentRecord.extra_metadata),
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      description: values.description,
      source: values.source,
      project: values.project && values.project.value,
      access_modifier: values.accessModifier,
      organisation: values.organisation && values.organisation.value,
      simulation_start: values.simulationStart,
      simulation_end: values.simulationEnd,
      simulation_identifier: values.simulationIdentifier,
      model_name: values.modelName,
      model_identifier: values.modelIdentifier,
      model_revision: values.modelRevision,
      extra_metadata: values.extraMetadata ? JSON.parse(values.extraMetadata) : {},
    };

    fetch(`/api/v4/scenarios/${currentRecord.uuid}/`, {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((data) => {
        const status = data.status;
        if (status === 200) {
          props.addNotification("Success! Scenario updated", 2000);
          props.history.push(navigationUrl);
        } else {
          props.addNotification(status, 2000);
          console.error(data);
        }
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
  } = useForm({ initialValues, onSubmit });

  return (
    <ExplainSideColumn
      imgUrl={threediIcon}
      imgAltDescription={"3Di icon"}
      headerText={"3Di Scenarios"}
      explanationText={scenarioFormHelpText[fieldOnFocus] || scenarioFormHelpText["default"]}
      backUrl={navigationUrl}
      fieldName={fieldOnFocus}
    >
      <form className={formStyles.Form} onSubmit={handleSubmit} onReset={handleReset}>
        <span className={`${formStyles.FormFieldTitle} ${formStyles.FirstFormFieldTitle}`}>
          1: General
        </span>
        <TextInput
          title={"Scenario name *"}
          name={"name"}
          placeholder={"Please enter at least 3 characters"}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {currentRecord ? (
          <TextInput
            title={"UUID"}
            name={"uuid"}
            value={values.uuid}
            valueChanged={handleInputChange}
            validated
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly
          />
        ) : null}
        <TextArea
          title={"Description"}
          name={"description"}
          value={values.description}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
        />
        <TextInput
          title={"Source"}
          name={"source"}
          value={values.source}
          valueChanged={handleInputChange}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={"Project"}
          name={"project"}
          placeholder={"- Search and select -"}
          value={values.project}
          valueChanged={(value) => handleValueChange("project", value)}
          options={[]}
          validated
          isAsync
          isCached
          loadOptions={(input) => fetchProjects(input, selectedOrganisation.uuid)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={"Simulation start"}
          name={"simulationStart"}
          value={values.simulationStart}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
        />
        <TextInput
          title={"Simulation end"}
          name={"simulationEnd"}
          value={values.simulationEnd}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
        />
        <TextInput
          title={"Simulation identifier"}
          name={"simulationIdentifier"}
          value={values.simulationIdentifier}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
        />
        <TextArea
          title={"Based on model"}
          name={"modelName"}
          value={values.modelName}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
        />
        <TextInput
          title={"Model identifier"}
          name={"modelIdentifier"}
          value={values.modelIdentifier}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
        />
        <TextInput
          title={"Model revision"}
          name={"modelRevision"}
          value={values.modelRevision}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
        />
        <span className={formStyles.FormFieldTitle}>2: Data</span>
        <ScenarioResult
          name={"results"}
          uuid={currentRecord.uuid}
          formSubmitted={formSubmitted}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextArea
          title={"Extra metadata (JSON)"}
          name={"extraMetadata"}
          placeholder={"Please enter in valid JSON format"}
          value={values.extraMetadata}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!jsonValidator(values.extraMetadata)}
          errorMessage={jsonValidator(values.extraMetadata)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>3: Rights</span>
        <AccessModifier
          title={"Accessibility *"}
          name={"accessModifier"}
          value={values.accessModifier}
          valueChanged={(value) => handleValueChange("accessModifier", value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={"Organisation *"}
          name={"organisation"}
          placeholder={"- Search and select -"}
          value={values.organisation}
          valueChanged={(value) => handleValueChange("organisation", value)}
          options={organisations.map((organisation) =>
            convertToSelectObject(organisation.uuid, organisation.name)
          )}
          validated={values.organisation !== null && values.organisation !== ""}
          errorMessage={"Please select an organisation"}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={
            !(organisationsToSwitchTo.length > 0 && selectedOrganisation.roles.includes("admin"))
          }
          dropUp
        />
        <div className={formStyles.ButtonContainer}>
          <CancelButton url={navigationUrl} />
          <SubmitButton onClick={tryToSubmitForm} />
        </div>
      </form>
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: AppDispatch) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

export default connect(null, mapPropsToDispatch)(withRouter(ScenarioForm));
