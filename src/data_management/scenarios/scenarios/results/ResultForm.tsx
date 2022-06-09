import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "react-redux";
import { AppDispatch } from "../../../..";
import { ExplainSideColumn } from "../../../../components/ExplainSideColumn";
import { TextInput } from "../../../../form/TextInput";
import { TextArea } from "../../../../form/TextArea";
import { SubmitButton } from "../../../../form/SubmitButton";
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
  resultType?: string | null;
  submit: () => void;
}
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void;
}

interface RouteParams {
  uuid: string;
  id: string;
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
  const { currentRecord, rasterLayer, resultType, submit } = props;
  const { uuid } = props.match.params;
  const newResultForm = !!resultType;

  const initialValues = currentRecord ? {
    name: currentRecord.name,
    id: currentRecord.id,
    description: currentRecord.description,
    code: currentRecord.code,
    raster: rasterLayer ? convertToSelectObject(rasterLayer.uuid, rasterLayer.name) : null,
    family: currentRecord.family ? convertToSelectObject(currentRecord.family) : null,
  } : {
    name: null,
    description: null,
    code: null,
    raster: null,
    family: resultType ? convertToSelectObject(resultType) : null,
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
            submit();
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
      fetch(`/api/v4/scenarios/${uuid}/results/${currentRecord.id}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((data) => {
          const status = data.status;
          if (status === 200) {
            props.addNotification("Success! Result updated", 2000);
            submit();
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
      fieldName={fieldOnFocus}
    >
      <form className={formStyles.Form} onSubmit={handleSubmit} onReset={handleReset}>
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
        <TextInput
          title={"Code *"}
          name={"code"}
          value={values.code}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.code)}
          errorMessage={minLength(1, values.code)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextArea
          title={"Description"}
          name={"description"}
          value={values.description}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={"Result type *"}
          name={"family"}
          placeholder={"- Select -"}
          value={values.family}
          valueChanged={(value) => handleValueChange("family", value)}
          options={[
            {
              value: "Basic",
              label: "Basic"
            },
            {
              value: "Arrival",
              label: "Arrival"
            },
            {
              value: "Damage",
              label: "Damage"
            }
          ]}
          validated={!!values.family}
          errorMessage={"Please select an option"}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={newResultForm}
        />
        <SelectDropdown
          title={"Raster layer"}
          name={"raster"}
          placeholder={"- Search and select -"}
          value={values.raster}
          valueChanged={(value) => handleValueChange("raster", value)}
          options={[]}
          dropUp
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
        <div className={formStyles.ButtonContainer}>
          <div />
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
