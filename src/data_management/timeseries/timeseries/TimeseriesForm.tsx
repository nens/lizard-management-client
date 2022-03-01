import { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect, useSelector } from "react-redux";
import { AppDispatch } from "../../..";
import { getLocation, getSelectedOrganisation, getUsername } from "../../../reducers";
import { ExplainSideColumn } from "../../../components/ExplainSideColumn";
import { TextInput } from "./../../../form/TextInput";
import { AccessModifier } from "../../../form/AccessModifier";
import { SelectDropdown } from "../../../form/SelectDropdown";
import { DurationField } from "../../../form/DurationField";
import { CheckBox } from "../../../form/CheckBox";
import { TextArea } from "../../../form/TextArea";
import { AcceptedFile, UploadData } from "../../../form/UploadData";
import { SubmitButton } from "../../../form/SubmitButton";
import { CancelButton } from "../../../form/CancelButton";
import { useForm, Values } from "../../../form/useForm";
import { jsonValidator, minLength, required } from "../../../form/validators";
import { fetchSuppliers } from "../../rasters/RasterSourceForm";
import { fetchObservationTypes } from "../../rasters/RasterLayerForm";
import { addNotification, removeLocation } from "../../../actions";
import { convertToSelectObject } from "../../../utils/convertToSelectObject";
import { fromISOValue, toISOValue } from "../../../utils/isoUtils";
import {
  convertDurationObjToSeconds,
  convertSecondsToDurationObject,
} from "../../../utils/dateUtils";
import { timeseriesFormHelpText } from "../../../utils/help_texts/helpTextForTimeseries";
import { fetchWithOptions } from "../../../utils/fetchWithOptions";
import { baseUrl } from "./TimeseriesTable";
import { TimeseriesFromTimeseriesEndpoint } from "../../../types/timeseriesType";
import { LocationFromAPI } from "../../../types/locationFormTypes";
import FormActionButtons from "../../../components/FormActionButtons";
import DeleteModal from "../../../components/DeleteModal";
import formStyles from "./../../../styles/Forms.module.css";
import timeseriesIcon from "../../../images/timeseries_icon.svg";

export interface Datasource {
  id: number;
  name: string;
}

interface Props {
  currentRecord?: TimeseriesFromTimeseriesEndpoint;
  datasource?: Datasource;
}

const backUrl = "/management/data_management/timeseries/timeseries";

// Helper function to fetch locations in async select dropdown
const fetchLocations = async (searchInput: string, organisationUuid: string) => {
  const params = [`organisation__uuid=${organisationUuid}`, "writable=true", "page_size=20"];

  if (searchInput) params.push(`name__startswith=${searchInput}`);
  const urlQuery = params.join("&");

  const response = await fetch(`/api/v4/locations/?${urlQuery}`, {
    credentials: "same-origin",
  });
  const responseJSON = await response.json();

  return responseJSON.results.map((location: LocationFromAPI) =>
    convertToSelectObject(location.uuid, location.name)
  );
};

// Helper function to fetch datasources in async select dropdown
const fetchDatasources = async (searchInput: string) => {
  const response = await fetch(`/api/v4/datasources/?page_size=20`, {
    credentials: "same-origin",
  });
  const responseJSON = await response.json();

  return responseJSON.results.map((datasource: Datasource) =>
    convertToSelectObject(datasource.id, datasource.name)
  );
};

const TimeseriesForm = (props: Props & DispatchProps & RouteComponentProps) => {
  const { currentRecord, datasource, removeLocation } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const username = useSelector(getUsername);
  const location = useSelector(getLocation);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      removeLocation();
    };
  }, [removeLocation]);

  const initialValues = currentRecord
    ? {
        name: currentRecord.name,
        code: currentRecord.code,
        observationType: currentRecord.observation_type
          ? convertToSelectObject(
              currentRecord.observation_type.id,
              currentRecord.observation_type.code
            )
          : null,
        location: currentRecord.location
          ? convertToSelectObject(currentRecord.location.uuid, currentRecord.location.name)
          : null,
        valueType: currentRecord.value_type
          ? convertToSelectObject(currentRecord.value_type)
          : null,
        datasource:
          currentRecord.datasource && datasource
            ? convertToSelectObject(datasource.id, datasource.name)
            : null,
        intervalCheckbox: !(currentRecord.interval === null),
        interval: currentRecord.interval
          ? toISOValue(convertSecondsToDurationObject(currentRecord.interval))
          : "",
        extraMetadata: JSON.stringify(currentRecord.extra_metadata),
        accessModifier: currentRecord.access_modifier,
        supplier: currentRecord.supplier ? convertToSelectObject(currentRecord.supplier) : null,
        supplierCode: currentRecord.supplier_code,
        data: [],
      }
    : {
        name: null,
        code: null,
        observationType: null,
        location: location ? convertToSelectObject(location.uuid, location.name) : null,
        value_type: null,
        datasource: null,
        intervalCheckbox: false,
        interval: null,
        extraMetadata: null,
        accessModifier: "Private",
        supplier: username ? convertToSelectObject(username) : null,
        supplierCode: null,
        data: [],
      };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      code: values.code,
      observation_type: values.observationType && values.observationType.value,
      location: values.location && values.location.value,
      value_type: values.valueType && values.valueType.value,
      datasource: values.datasource && values.datasource.value,
      interval: values.intervalCheckbox
        ? convertDurationObjToSeconds(fromISOValue(values.interval))
        : null,
      extra_metadata: values.extraMetadata ? JSON.parse(values.extraMetadata) : {},
      access_modifier: values.accessModifier,
      supplier: values.supplier && values.supplier.label,
      supplier_code: values.supplierCode,
    };

    if (!currentRecord) {
      fetch("/api/v4/timeseries/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            props.addNotification("Success! New time series created", 2000);
            props.history.push(backUrl);
            return response.json();
          } else if (status === 403) {
            props.addNotification("Not authorized", 2000);
            console.error(response);
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          }
        })
        .then((parsedRes) => {
          // Upload .csv files
          const acceptedFiles = (values.data as AcceptedFile[]) || [];
          const uploadFiles = acceptedFiles.map((f) => f.file);
          handleCsvFilesUpload(uploadFiles, parsedRes.uuid);
        })
        .catch(console.error);
    } else {
      fetch(`/api/v4/timeseries/${currentRecord.uuid}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          const status = response.status;
          if (status === 200) {
            props.addNotification("Success! Time series updated", 2000);
            props.history.push(backUrl);
            // Upload .csv files
            const acceptedFiles = (values.data as AcceptedFile[]) || [];
            const uploadFiles = acceptedFiles.map((f) => f.file);
            handleCsvFilesUpload(uploadFiles, currentRecord.uuid);
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          }
        })
        .catch(console.error);
    }
  };

  // Upload .csv files to timeseries by sending a POST request
  // to the event list endpoint of the timeseries
  const handleCsvFilesUpload = (files: File[], uuid: string) => {
    if (!uuid || files.length === 0) return;
    return files.map((file) => {
      const form = new FormData();
      form.append("file", file);
      return fetch(`/api/v4/timeseries/${uuid}/events/`, {
        credentials: "same-origin",
        method: "POST",
        headers: {
          mimeType: "multipart/form-data",
        },
        body: form,
      })
        .then((res) => {
          if (res.status === 204) {
            props.addNotification(
              <span>
                <span>
                  <b>{file.name}</b> successfully imported! All time series events can be seen here:{" "}
                </span>
                <a href={`/api/v4/timeseries/${uuid}/events`} target="_blank" rel="noreferrer">
                  Time series Events API
                </a>
              </span>
            );
          } else {
            props.addNotification(res.status, 2000);
            console.error(file.name, res);
          }
        })
        .catch(console.error);
    });
  };

  const {
    values,
    triedToSubmit,
    // formSubmitted,
    tryToSubmitForm,
    handleInputChange,
    handleValueChange,
    handleSubmit,
    handleReset,
    clearInput,
    fieldOnFocus,
    handleBlur,
    handleFocus,
  } = useForm({ initialValues, onSubmit });

  return (
    <ExplainSideColumn
      imgUrl={timeseriesIcon}
      imgAltDescription={"Timeseries icon"}
      headerText={"Time Series"}
      explanationText={timeseriesFormHelpText[fieldOnFocus] || timeseriesFormHelpText["default"]}
      backUrl={backUrl}
      fieldName={fieldOnFocus}
    >
      <form className={formStyles.Form} onSubmit={handleSubmit} onReset={handleReset}>
        <span className={`${formStyles.FormFieldTitle} ${formStyles.FirstFormFieldTitle}`}>
          1: General
        </span>
        <TextInput
          title={"Name *"}
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
            value={currentRecord.uuid}
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
          placeholder={"Please enter at least 1 character"}
          value={values.code}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.code)}
          errorMessage={minLength(1, values.code)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>2: Data</span>
        <SelectDropdown
          title={"Observation type *"}
          name={"observationType"}
          placeholder={"- Search and select -"}
          value={values.observationType}
          valueChanged={(value) => handleValueChange("observationType", value)}
          options={[]}
          validated={!required("Please select an observation type", values.observationType)}
          errorMessage={required("Please select an observation type", values.observationType)}
          triedToSubmit={triedToSubmit}
          isAsync
          isCached
          loadOptions={fetchObservationTypes}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={"Location *"}
          name={"location"}
          placeholder={"- Search and select -"}
          value={values.location}
          valueChanged={(value) => handleValueChange("location", value)}
          options={[]}
          validated={!required("Please select a location", values.location)}
          errorMessage={required("Please select a location", values.location)}
          triedToSubmit={triedToSubmit}
          isAsync
          isCached
          loadOptions={(searchInput) => fetchLocations(searchInput, selectedOrganisation.uuid)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={!!location}
        />
        <SelectDropdown
          title={"Value type *"}
          name={"valueType"}
          placeholder={"- Select -"}
          value={values.valueType}
          valueChanged={(value) => handleValueChange("valueType", value)}
          options={[
            {
              value: "integer",
              label: "integer",
            },
            {
              value: "float",
              label: "float",
            },
            {
              value: "boolean",
              label: "boolean",
            },
            {
              value: "text",
              label: "text",
            },
            {
              value: "image",
              label: "image",
            },
            {
              value: "movie",
              label: "movie",
            },
            {
              value: "file",
              label: "file",
            },
            {
              value: "float array",
              label: "float array",
            },
          ]}
          validated={!!values.valueType}
          errorMessage={"Please select an option"}
          triedToSubmit={triedToSubmit}
          isSearchable={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={"Datasource"}
          name={"datasource"}
          placeholder={"- Search and select -"}
          value={values.datasource}
          valueChanged={(value) => handleValueChange("datasource", value)}
          options={[]}
          validated
          isAsync
          isCached
          loadOptions={fetchDatasources}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <label htmlFor={"interval"} className={formStyles.Label}>
          <span className={formStyles.LabelTitle}>Interval</span>
          <CheckBox
            title={""}
            name={"intervalCheckbox"}
            value={values.intervalCheckbox}
            valueChanged={(bool) => handleValueChange("intervalCheckbox", bool)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <DurationField
            title={""}
            name={"interval"}
            value={values.interval}
            valueChanged={(value) => handleValueChange("interval", value)}
            validated
            readOnly={!values.intervalCheckbox}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </label>
        <UploadData
          title={"CSV Files"}
          name={"data"}
          temporal={false}
          fileTypes={[".csv"]}
          data={values.data}
          setData={(data) => handleValueChange("data", data)}
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
          title={"Username of supplier"}
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
        <TextInput
          title={"Supplier code"}
          name={"supplierCode"}
          value={values.supplierCode}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly={!selectedOrganisation.roles.includes("admin")}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div className={formStyles.ButtonContainer}>
          <CancelButton url={backUrl} />
          <div style={{ display: "flex" }}>
            {currentRecord ? (
              <div style={{ marginRight: 16 }}>
                <FormActionButtons
                  actions={[
                    {
                      displayValue: "Delete",
                      actionFunction: () => setShowDeleteModal(true),
                    },
                  ]}
                />
              </div>
            ) : null}
            <SubmitButton onClick={tryToSubmitForm} />
          </div>
        </div>
      </form>
      {currentRecord && showDeleteModal ? (
        <DeleteModal
          rows={[currentRecord]}
          displayContent={[
            { name: "name", width: 40 },
            { name: "uuid", width: 60 },
          ]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          handleClose={() => setShowDeleteModal(false)}
          tableUrl={backUrl}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: AppDispatch) => ({
  removeLocation: () => dispatch(removeLocation()),
  addNotification: (message: string | number | JSX.Element, timeout?: number) =>
    dispatch(addNotification(message, timeout)),
});
type DispatchProps = ReturnType<typeof mapPropsToDispatch>;

export default connect(null, mapPropsToDispatch)(withRouter(TimeseriesForm));
