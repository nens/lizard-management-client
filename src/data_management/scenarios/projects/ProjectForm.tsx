import { RouteComponentProps, withRouter } from "react-router";
import { connect, useSelector } from "react-redux";
import { getOrganisations, getSelectedOrganisation } from "../../../reducers";
import { AppDispatch } from "../../..";
import { ExplainSideColumn } from "../../../components/ExplainSideColumn";
import { TextInput } from "./../../../form/TextInput";
import { AccessModifier } from "../../../form/AccessModifier";
import { SubmitButton } from "../../../form/SubmitButton";
import { CancelButton } from "../../../form/CancelButton";
import { useForm, Values } from "../../../form/useForm";
import { minLength } from "../../../form/validators";
import { addNotification } from "../../../actions";
import { projectFormHelpText } from "../../../utils/help_texts/helpTextForProject";
import { convertToSelectObject } from "../../../utils/convertToSelectObject";
import { Project } from "../../../types/projectType";
import { SelectDropdown } from "../../../form/SelectDropdown";
import { fetchSuppliers } from "../../rasters/RasterSourceForm";
import { TextArea } from "../../../form/TextArea";
import projectIcon from "../../../images/project.svg";
import formStyles from "./../../../styles/Forms.module.css";

interface Props {
  currentRecord?: Project | null;
}
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void;
}
interface RouteParams {
  uuid: string;
}

const navigationUrl = "/management/data_management/scenarios/projects";

const ProjectForm: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (props) => {
  const { currentRecord } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const organisations = useSelector(getOrganisations).available;
  const organisationsToSwitchTo = organisations.filter((org) => org.roles.includes("admin"));

  const initialValues = currentRecord ? {
    name: currentRecord.name,
    uuid: currentRecord.uuid,
    code: currentRecord.code,
    description: currentRecord.description,
    accessModifier: currentRecord.access_modifier,
    organisation: currentRecord.organisation ? convertToSelectObject(currentRecord.organisation.uuid, currentRecord.organisation.name) : null,
    supplier: currentRecord.supplier ? convertToSelectObject(currentRecord.supplier) : null,
  } : {
    name: null,
    code: null,
    description: null,
    accessModifier: "Private",
    organisation: selectedOrganisation ? convertToSelectObject(selectedOrganisation.uuid, selectedOrganisation.name) : null,
    supplier: null,
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      code: values.code,
      description: values.description,
      access_modifier: values.accessModifier,
      organisation: values.organisation && values.organisation.value,
      supplier: values.supplier && values.supplier.label,
    };

    if (!currentRecord) {
      fetch("/api/v4/projects/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            props.addNotification("Success! New project created", 2000);
            props.history.push(navigationUrl);
          } else if (status === 403) {
            props.addNotification("Not authorized", 2000);
            console.error(response);
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          }
        })
        .catch(console.error);
    } else {
      fetch(`/api/v4/projects/${currentRecord.uuid}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((data) => {
          const status = data.status;
          if (status === 200) {
            props.addNotification("Success! Project updated", 2000);
            props.history.push(navigationUrl);
          } else {
            props.addNotification(status, 2000);
            console.error(data);
          }
        })
        .catch(console.error);
    }
  };

  const {
    values,
    triedToSubmit,
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
      imgUrl={projectIcon}
      imgAltDescription={"Projects"}
      headerText={"Projects"}
      explanationText={projectFormHelpText[fieldOnFocus] || projectFormHelpText["default"]}
      backUrl={navigationUrl}
      fieldName={fieldOnFocus}
    >
      <form className={formStyles.Form} onSubmit={handleSubmit} onReset={handleReset}>
        <span className={`${formStyles.FormFieldTitle} ${formStyles.FirstFormFieldTitle}`}>
          1: General
        </span>
        <TextInput
          title={"Project name *"}
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
          title={"Code"}
          name={"code"}
          value={values.code}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
        />
        <span className={formStyles.FormFieldTitle}>2: Rights</span>
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
        />
        <SelectDropdown
          title={"Supplier"}
          name={"supplier"}
          placeholder={"- Search and select -"}
          value={values.supplier}
          valueChanged={(value) => handleValueChange("supplier", value)}
          options={[]}
          validated
          isAsync
          isCached
          loadOptions={(searchInput) => fetchSuppliers(selectedOrganisation.uuid, searchInput)}
          readOnly={!selectedOrganisation.roles.includes("admin")}
          dropUp
          onFocus={handleFocus}
          onBlur={handleBlur}
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
  addNotification: (message: string | number, timeout: number) =>
    dispatch(addNotification(message, timeout)),
});

export default connect(null, mapPropsToDispatch)(withRouter(ProjectForm));
