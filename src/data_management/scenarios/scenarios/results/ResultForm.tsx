import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "react-redux";
import { AppDispatch } from "../../../..";
import { ExplainSideColumn } from "../../../../components/ExplainSideColumn";
import { TextInput } from "../../../../form/TextInput";
import { TextArea } from "../../../../form/TextArea";
import { SubmitButton } from "../../../../form/SubmitButton";
import { CancelButton } from "../../../../form/CancelButton";
import { useForm, Values } from "../../../../form/useForm";
import { minLength } from "../../../../form/validators";
import { SelectDropdown } from "../../../../form/SelectDropdown";
import { addNotification } from "../../../../actions";
import { ScenarioResult } from "../../../../types/scenarioType";
import { convertToSelectObject } from "../../../../utils/convertToSelectObject";
import { scenarioResultFormHelpText } from "../../../../utils/help_texts/helpTextForScenarioResult";
import threediIcon from "../../../../images/3di@3x.svg";
import formStyles from "./../../../../styles/Forms.module.css";

interface Props {
  currentRecord?: ScenarioResult;
}
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void;
}
interface RouteParams {
  uuid: string;
}

const navigationUrl = "/management/data_management/scenarios/scenarios";

const ResultForm: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (
  props
) => {
  const { currentRecord } = props;

  const initialValues = currentRecord ? {
    name: currentRecord.name,
    id: currentRecord.id,
    description: currentRecord.description,
    code: currentRecord.code,
    scenario: currentRecord.scenario,
    raster: currentRecord.raster,
    family: currentRecord.family ? convertToSelectObject(currentRecord.family) : null,
  } : {
    name: null,
    description: null,
    code: null,
    scenario: null,
    raster: null,
    family: null,
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      description: values.description,
      code: values.code,
      scenario: values.scenario,
      raster: values.raster,
      family: values.family && values.family.value,
    };

    if (!currentRecord) {
      fetch("/api/v4/scenarios/uuid/results/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            props.addNotification("Success! New result created", 2000);
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
      fetch(`/api/v4/scenarios/uuid/results/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((data) => {
          const status = data.status;
          if (status === 200) {
            props.addNotification("Success! Result updated", 2000);
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
      imgUrl={threediIcon}
      imgAltDescription={"3Di icon"}
      headerText={"Scenario Result"}
      explanationText={scenarioResultFormHelpText[fieldOnFocus] || scenarioResultFormHelpText["default"]}
      backUrl={navigationUrl}
      fieldName={fieldOnFocus}
    >
      <form className={formStyles.Form} onSubmit={handleSubmit} onReset={handleReset}>
        <span className={`${formStyles.FormFieldTitle} ${formStyles.FirstFormFieldTitle}`}>
          1: General
        </span>
        <TextInput
          title={"Scenario result name *"}
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
            title={"Result ID"}
            name={"id"}
            value={values.id}
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
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={"Scenario"}
          name={"scenario"}
          value={values.scenario}
          valueChanged={handleInputChange}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={"Raster layer"}
          name={"raster"}
          value={values.raster}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
        />
        <SelectDropdown
          title={"Family"}
          name={"family"}
          placeholder={"- Select -"}
          value={values.family}
          valueChanged={(value) => handleValueChange("family", value)}
          options={[
            {
              value: "B",
              label: "Basic"
            },
            {
              value: "A",
              label: "Arrival"
            },
            {
              value: "D",
              label: "Damage"
            }
          ]}
          validated={!!values.family}
          errorMessage={"Please select an option"}
          triedToSubmit={triedToSubmit}
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
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

export default connect(null, mapPropsToDispatch)(withRouter(ResultForm));
