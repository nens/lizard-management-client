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
import { fetchRasterLayersV4, RasterLayerFromAPI } from "../../../../api/rasters";
import { UUID_REGEX } from "../../../../components/Breadcrumbs";
import threediIcon from "../../../../images/3di@3x.svg";
import formStyles from "./../../../../styles/Forms.module.css";

interface Props {
  currentRecord?: ScenarioResult;
  rasterLayer?: RasterLayerFromAPI | null;
}
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void;
}
interface RouteParams {
  uuid: string;
  id: string;
}

const getResultFamilyTypeLabel = (result: ScenarioResult) => {
  if (result.family === "R") {
    return "Raw";
  } else if (result.family === "B") {
    return "Basic";
  } else if (result.family === "A") {
    return "Arrival";
  } else { // family is "D"
    return "Damage";
  };
}

// Helper function to fetch paginated raster layers with search query
const fetchRasterLayers = async (searchQuery: string) => {
  const params = ["page_size=20"];

  if (searchQuery) {
    if (UUID_REGEX.test(searchQuery)) {
      params.push(`uuid=${searchQuery}`);
    } else {
      params.push(`name__icontains=${searchQuery}`);
    }
  }

  const urlQuery = params.join("&");
  const response = await fetchRasterLayersV4(urlQuery);

  return response.results.map((raster: RasterLayerFromAPI) =>
    convertToSelectObject(raster.uuid, raster.name)
  );
}

const ResultForm: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (
  props
) => {
  const { currentRecord, rasterLayer } = props;
  const { uuid, id } = props.match.params;

  const navigationUrl = `/management/data_management/scenarios/scenarios/${uuid}`;

  const initialValues = currentRecord ? {
    name: currentRecord.name,
    id: currentRecord.id,
    description: currentRecord.description,
    code: currentRecord.code,
    raster: rasterLayer ? convertToSelectObject(rasterLayer.uuid, rasterLayer.name) : null,
    family: currentRecord.family ? convertToSelectObject(currentRecord.family, getResultFamilyTypeLabel(currentRecord)) : null,
  } : {
    name: null,
    description: null,
    code: null,
    raster: null,
    family: null,
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      description: values.description,
      code: values.code,
      raster: values.raster && values.raster.value,
      family: values.family && values.family.value,
      attachment_url: null,
    };

    if (!currentRecord) {
      fetch(`/api/v4/scenarios/${uuid}/results/`, {
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
      fetch(`/api/v4/scenarios/${uuid}/results/${id}/`, {
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
        <SelectDropdown
          title={"Raster layer"}
          name={"raster"}
          placeholder={"- Search and select -"}
          value={values.raster}
          valueChanged={(value) => handleValueChange("raster", value)}
          options={[]}
          validated
          isAsync
          isCached
          loadOptions={fetchRasterLayers}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {values.raster ? (
          <div className={formStyles.Label}>
            <span className={formStyles.LabelTitle}>Link to selected raster layer</span>
            <a
              href={`/management/data_management/rasters/layers/${values.raster.value}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {values.raster.label}
            </a>
          </div>
        ) : null}
        <SelectDropdown
          title={"Family *"}
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
