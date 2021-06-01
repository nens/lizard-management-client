import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { getLocation, getSelectedOrganisation, getSupplierIds, getUsername } from '../../../reducers';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { TextInput } from './../../../form/TextInput';
import { AccessModifier } from '../../../form/AccessModifier';
import { SelectDropdown } from '../../../form/SelectDropdown';
import { DurationField } from '../../../form/DurationField';
import { CheckBox } from '../../../form/CheckBox';
import { TextArea } from '../../../form/TextArea';
import { UploadCsv } from '../../../form/UploadCsv';
import { SubmitButton } from '../../../form/SubmitButton';
import { CancelButton } from '../../../form/CancelButton';
import { useForm, Values } from '../../../form/useForm';
import { jsonValidator, minLength, required } from '../../../form/validators';
import { fetchObservationTypes } from '../../rasters/RasterLayerForm';
import { addNotification, removeLocation } from '../../../actions';
import { convertToSelectObject } from '../../../utils/convertToSelectObject';
import { fromISOValue, toISOValue } from '../../../utils/isoUtils';
import { convertDurationObjToSeconds, convertSecondsToDurationObject } from '../../../utils/dateUtils';
import { timeseriesFormHelpText } from '../../../utils/help_texts/helpTextForTimeseries';
import { fetchWithOptions } from '../../../utils/fetchWithOptions';
import { baseUrl } from './TimeseriesTable';
import FormActionButtons from '../../../components/FormActionButtons';
import DeleteModal from '../../../components/DeleteModal';
import formStyles from './../../../styles/Forms.module.css';
import timeseriesIcon from "../../../images/timeseries_icon.svg";

export interface Datasource {
  id: number,
  name: string,
};

interface Props {
  currentTimeseries?: any,
  datasource?: Datasource,
};

const backUrl = "/data_management/timeseries/timeseries";

// Helper function to fetch locations in async select dropdown
const fetchLocations = async (searchInput: string, organisationUuid: string) => {
  const params=[`organisation__uuid=${organisationUuid}`, "writable=true"];

  if (searchInput) params.push(`name__startswith=${searchInput}`);
  const urlQuery = params.join('&');

  const response = await fetch(`/api/v4/locations/?${urlQuery}`, {
    credentials: "same-origin"
  });
  const responseJSON = await response.json();

  return responseJSON.results.map((location: any) => convertToSelectObject(location.uuid, location.name));
};

// Helper function to fetch datasources in async select dropdown
const fetchDatasources = async (searchInput: string) => {
  const response = await fetch(`/api/v4/datasources/`, {
    credentials: 'same-origin'
  });
  const responseJSON = await response.json();

  return responseJSON.results.map((datasource: any) => convertToSelectObject(datasource.id, datasource.name));
};

const TimeseriesForm = (props: Props & DispatchProps & RouteComponentProps) => {
  const { currentTimeseries, datasource, removeLocation } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const username = useSelector(getUsername);
  const supplierIds = useSelector(getSupplierIds).available;
  const location = useSelector(getLocation);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      removeLocation();
    };
  }, [removeLocation]);

  const initialValues = currentTimeseries ? {
    name: currentTimeseries.name,
    code: currentTimeseries.code,
    observationType: currentTimeseries.observation_type ? convertToSelectObject(currentTimeseries.observation_type.id, currentTimeseries.observation_type.code) : null,
    location: currentTimeseries.location ? convertToSelectObject(currentTimeseries.location.uuid, currentTimeseries.location.name) : null,
    valueType: currentTimeseries.value_type ? convertToSelectObject(currentTimeseries.value_type) : null,
    datasource: currentTimeseries.datasource && datasource ? convertToSelectObject(datasource.id, datasource.name) : null,
    intervalCheckbox: !(currentTimeseries.interval === null),
    interval: currentTimeseries.interval ? toISOValue(convertSecondsToDurationObject(currentTimeseries.interval)) : '',
    extraMetadata: JSON.stringify(currentTimeseries.extra_metadata),
    accessModifier: currentTimeseries.access_modifier,
    supplier: currentTimeseries.supplier ? convertToSelectObject(currentTimeseries.supplier) : null,
    supplierCode: currentTimeseries.supplier_code,
    files: [],
  } : {
    name: null,
    code: null,
    observationType: null,
    location: location ? convertToSelectObject(location.uuid, location.name) : null,
    value_type: null,
    datasource: null,
    intervalCheckbox: false,
    interval: null,
    extraMetadata: null,
    accessModifier: 'Private',
    supplier: username ? convertToSelectObject(username) : null,
    supplierCode: null,
    files: [],
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      code: values.code,
      observation_type: values.observationType && values.observationType.value,
      location: values.location && values.location.value,
      value_type: values.valueType && values.valueType.value,
      datasource: values.datasource && values.datasource.value,
      interval: values.intervalCheckbox ? convertDurationObjToSeconds(fromISOValue(values.interval)) : null,
      extra_metadata: values.extraMetadata ? JSON.parse(values.extraMetadata) : {},
      access_modifier: values.accessModifier,
      supplier: values.supplier && values.supplier.value,
      supplier_code: values.supplierCode,
    };

    if (!currentTimeseries) {
      fetch("/api/v4/timeseries/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(response => {
        const status = response.status;
        if (status === 201) {
          props.addNotification('Success! New time series created', 2000);
          props.history.push(backUrl);
          return response.json();
        } else if (status === 403) {
          props.addNotification("Not authorized", 2000);
          console.error(response);
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        };
      })
      .then(parsedRes => {
        // Upload .csv files
        handleCsvFilesUpload(values.files, parsedRes.uuid);
      })
      .catch(console.error);
    } else {
      fetch(`/api/v4/timeseries/${currentTimeseries.uuid}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(response => {
        const status = response.status;
        if (status === 200) {
          props.addNotification('Success! Time series updated', 2000);
          props.history.push(backUrl);
          // Upload .csv files
          handleCsvFilesUpload(values.files, currentTimeseries.uuid);
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        }
      })
      .catch(console.error);
    };
  };

  // Upload .csv files to timeseries by sending a POST request
  // to the event list endpoint of the timeseries
  const handleCsvFilesUpload = (files: File[], uuid: string) => {
    if (!uuid || files.length === 0) return;
    return files.map(file => {
      const form = new FormData();
      form.append("file", file);
      return fetch(`/api/v4/timeseries/${uuid}/events/`, {
        credentials: "same-origin",
        method: "POST",
        headers: {
          mimeType: "multipart/form-data"
        },
        body: form
      }).then(res => {
        if (res.status === 204) {
          props.addNotification(`${file.name} successfully imported!`, 2000);
        } else {
          props.addNotification(res.status, 2000);
          console.error(file.name, res);
        };
      }).catch(console.error);
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
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={timeseriesIcon}
      imgAltDescription={"Timeseries icon"}
      headerText={"Time Series"}
      explanationText={timeseriesFormHelpText[fieldOnFocus] || timeseriesFormHelpText['default']}
      backUrl={backUrl}
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
          title={'Name *'}
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
        />
        {currentTimeseries ? (
          <TextInput
            title={'UUID'}
            name={'uuid'}
            value={currentTimeseries.uuid}
            valueChanged={handleInputChange}
            validated
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly
          />
        ) : null}
        <TextInput
          title={'Code *'}
          name={'code'}
          placeholder={'Please enter at least 1 character'}
          value={values.code}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.code)}
          errorMessage={minLength(1, values.code)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <SelectDropdown
          title={'Observation type *'}
          name={'observationType'}
          placeholder={'- Search and select -'}
          value={values.observationType}
          valueChanged={value => handleValueChange('observationType', value)}
          options={[]}
          validated={!required('Please select an observation type', values.observationType)}
          errorMessage={required('Please select an observation type', values.observationType)}
          triedToSubmit={triedToSubmit}
          isAsync
          isCached
          loadOptions={fetchObservationTypes}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={'Location *'}
          name={'location'}
          placeholder={'- Search and select -'}
          value={values.location}
          valueChanged={value => handleValueChange('location', value)}
          options={[]}
          validated={!required('Please select a location', values.location)}
          errorMessage={required('Please select a location', values.location)}
          triedToSubmit={triedToSubmit}
          isAsync
          isCached
          loadOptions={searchInput => fetchLocations(searchInput, selectedOrganisation.uuid)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={!!location}
        />
        <SelectDropdown
          title={'Value type *'}
          name={'valueType'}
          placeholder={'- Select -'}
          value={values.valueType}
          valueChanged={value => handleValueChange('valueType', value)}
          options={[
            {
              value: 'integer',
              label: 'integer'
            },
            {
              value: 'float',
              label: 'float'
            },
            {
              value: 'boolean',
              label: 'boolean'
            },
            {
              value: 'text',
              label: 'text'
            },
            {
              value: 'image',
              label: 'image'
            },
            {
              value: 'movie',
              label: 'movie'
            },
            {
              value: 'file',
              label: 'file'
            },
            {
              value: 'float array',
              label: 'float array'
            }
          ]}
          validated={!!values.valueType}
          errorMessage={'Please select an option'}
          triedToSubmit={triedToSubmit}
          isSearchable={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={'Datasource'}
          name={'datasource'}
          placeholder={'- Search and select -'}
          value={values.datasource}
          valueChanged={value => handleValueChange('datasource', value)}
          options={[]}
          validated
          isAsync
          isCached
          loadOptions={fetchDatasources}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <label
          htmlFor={'interval'}
          className={formStyles.Label}
        >
          <span className={formStyles.LabelTitle}>
            Interval
          </span>
          <CheckBox
            title={''}
            name={'intervalCheckbox'}
            value={values.intervalCheckbox}
            valueChanged={bool => handleValueChange('intervalCheckbox', bool)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <DurationField
            title={''}
            name={'interval'}
            value={values.interval}
            valueChanged={value => handleValueChange('interval', value)}
            validated
            readOnly={!values.intervalCheckbox}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </label>
        <UploadCsv
          title={'CSV Files'}
          name={'files'}
          data={values.files}
          setData={data => handleValueChange('files', data)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextArea
          title={'Extra metadata (JSON)'}
          name={'extraMetadata'}
          placeholder={'Please enter in valid JSON format'}
          value={values.extraMetadata}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!jsonValidator(values.extraMetadata)}
          errorMessage={jsonValidator(values.extraMetadata)}
          triedToSubmit={triedToSubmit}
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
        <SelectDropdown
          title={'Username of supplier'}
          name={'supplier'}
          placeholder={'- Search and select -'}
          value={values.supplier}
          valueChanged={value => handleValueChange('supplier', value)}
          options={supplierIds.map((suppl: any) => convertToSelectObject(suppl.username))}
          validated
          readOnly={!(supplierIds.length > 0 && selectedOrganisation.roles.includes('admin'))}
          dropUp
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Supplier code'}
          name={'supplierCode'}
          value={values.supplierCode}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly={!selectedOrganisation.roles.includes('admin')}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={backUrl}
          />
          <div style={{display: "flex"}}>
            {currentTimeseries ? (
              <div style={{ marginRight: 16 }}>
                <FormActionButtons
                  actions={[
                    {
                      displayValue: "Delete",
                      actionFunction: () => setShowDeleteModal(true)
                    },
                  ]} 
                />
              </div>
            ) : null}
            <SubmitButton
              onClick={tryToSubmitForm}
            />
          </div>
        </div>
      </form>
      {currentTimeseries && showDeleteModal ? (
        <DeleteModal
          rows={[currentTimeseries]}
          displayContent={[{name: "name", width: 40}, {name: "uuid", width: 60}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          handleClose={() => setShowDeleteModal(false)}
          tableUrl={backUrl}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  removeLocation: () => dispatch(removeLocation()),
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapPropsToDispatch>;

export default connect(null, mapPropsToDispatch)(withRouter(TimeseriesForm));