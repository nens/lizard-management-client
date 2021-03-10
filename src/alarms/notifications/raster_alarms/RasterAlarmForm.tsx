import React from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { TextInput } from './../../../form/TextInput';
import { SelectDropdown } from '../../../form/SelectDropdown';
import { SubmitButton } from '../../../form/SubmitButton';
import { CancelButton } from '../../../form/CancelButton';
import { useForm, Values } from '../../../form/useForm';
import { minLength, required } from '../../../form/validators';
import { addNotification } from '../../../actions';
import { getSelectedOrganisation } from '../../../reducers';
import { fetchRasterLayersV4, RasterLayerFromAPI } from '../../../api/rasters';
import { convertToSelectObject } from '../../../utils/convertToSelectObject';
import formStyles from './../../../styles/Forms.module.css';
import rasterAlarmIcon from "../../../images/alarm@3x.svg";
import { CheckBox } from '../../../form/CheckBox';
import { DurationField } from '../../../form/DurationField';
import { IntegerInput } from '../../../form/IntegerInput';
import { rasterIntervalStringServerToDurationObject, toISOValue } from '../../../utils/isoUtils';

interface Props {
  currentRasterAlarm?: any,
  raster?: RasterLayerFromAPI
};

// Helper function to fetch paginated observation types with search query
const fetchRasterLayers = async (uuid: string, searchQuery: string) => {
  const params=[`organisation__uuid=${uuid}`, "temporal=true"];

  // Regex expression to check if search input is UUID of raster source
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (searchQuery) {
    if (uuidRegex.test(searchQuery)) {
      params.push(`uuid=${searchQuery}`);
    } else {
      params.push(`name__icontains=${searchQuery}`);
    };
  };

  const urlQuery = params.join('&');
  const response = await fetchRasterLayersV4(urlQuery);

  return response.results.map((raster: any) => convertToSelectObject(raster.uuid, raster.name));
};

const RasterAlarmForm: React.FC<Props & DispatchProps & RouteComponentProps> = (props) => {
  const { currentRasterAlarm, raster } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const navigationUrl = "/alarms/notifications/raster_alarms";

  const initialValues = currentRasterAlarm && raster ? {
    name: currentRasterAlarm.name,
    raster: convertToSelectObject(raster.uuid!, raster.name),
    coordinates: currentRasterAlarm.geometry.coordinates,
    relative: !!currentRasterAlarm.relative_start || !!currentRasterAlarm.relative_end,
    relativeStart: currentRasterAlarm.relative_start ? toISOValue(rasterIntervalStringServerToDurationObject(currentRasterAlarm.relative_start)) : null,
    relativeEnd: currentRasterAlarm.relative_end ? toISOValue(rasterIntervalStringServerToDurationObject(currentRasterAlarm.relative_end)) : null,
    snoozeOn: currentRasterAlarm.snooze_sign_on,
    snoozeOff: currentRasterAlarm.snooze_sign_off,
    comparison: convertToSelectObject(currentRasterAlarm.comparison),
    thresholds: currentRasterAlarm.thresholds,
    messages: currentRasterAlarm.messages
  } : {
    name: null,
    raster: null,
    coordinates: null,
    relative: false,
    relativeStart: null,
    relativeEnd: null,
    snoozeOn: 1,
    snoozeOff: 1,
    comparison: convertToSelectObject('>'),
    thresholds: [],
    messages: []
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      raster: values.raster.value
    };

    if (!currentRasterAlarm) {
      fetch("/api/v4/rasteralarms/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          organisation: selectedOrganisation.uuid
        })
      })
      .then(response => {
        const status = response.status;
        if (status === 201) {
          props.addNotification('Success! New raster alarm created', 2000);
          props.history.push("/alarms/notifications/raster_alarms");
        } else if (status === 403) {
          props.addNotification("Not authorized", 2000);
          console.error(response);
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        };
      })
      .catch(console.error);
    } else {
      fetch(`/api/v4/contacts/${currentRasterAlarm.uuid}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(response => {
        const status = response.status;
        if (status === 200) {
          props.addNotification('Success! Raster alarm updated', 2000);
          props.history.push("/alarms/notifications/raster_alarms");
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        }
      })
      .catch(console.error);
    }
  }

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
    // fieldOnFocus,
    // handleBlur,
    // handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={rasterAlarmIcon}
      imgAltDescription={"Raster alarm icon"}
      headerText={"Raster alarms"}
      explanationText={"Select a field to get more information."}
      backUrl={"/alarms/notifications/raster_alarms"}
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
          title={'Name *'}
          name={'name'}
          placeholder={'Please enter at least 1 character'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.name)}
          errorMessage={minLength(1, values.name)}
          triedToSubmit={triedToSubmit}
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <SelectDropdown
          title={'Temporal raster *'}
          name={'raster'}
          placeholder={'- Search and select -'}
          value={values.raster}
          valueChanged={value => handleValueChange('raster', value)}
          options={[]}
          validated={!required('Please select a raster', values.raster)}
          errorMessage={required('Please select a raster', values.raster)}
          triedToSubmit={triedToSubmit}
          // onFocus={handleFocus}
          // onBlur={handleBlur}
          isAsync
          loadOptions={searchInput => fetchRasterLayers(selectedOrganisation.uuid, searchInput)}
        />
        <CheckBox
          title={'Use relative data'}
          name={'relative'}
          value={values.relative}
          valueChanged={bool => handleValueChange('relative', bool)}
        />
        <DurationField
          title={'Relative start'}
          name={'relativeStart'}
          value={values.relativeStart}
          valueChanged={value => handleValueChange('relativeStart', value)}
          validated
          readOnly={!values.relative}
        />
        <DurationField
          title={'Relative end'}
          name={'relativeEnd'}
          value={values.relativeEnd}
          valueChanged={value => handleValueChange('relativeEnd', value)}
          validated
          readOnly={!values.relative}
        />
        <IntegerInput
          title={'Snooze alarm after breaking threshold'}
          name={'snoozeOn'}
          value={values.snoozeOn}
          valueChanged={handleInputChange}
          validated
        />
        <IntegerInput
          title={'Snooze alarm after no further impact'}
          name={'snoozeOff'}
          value={values.snoozeOff}
          valueChanged={handleInputChange}
          validated
        />
        <SelectDropdown
          title={'Threshold comparison'}
          name={'comparison'}
          value={values.comparison}
          valueChanged={value => handleValueChange('comparison', value)}
          options={[
            {
              value: '>',
              label: '>',
              subLabel: 'higher than'
            },
            {
              value: '<',
              label: '<',
              subLabel: 'lower than'
            }
          ]}
          validated
          isSearchable={false}
          isClearable={false}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={navigationUrl}
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
type DispatchProps = ReturnType<typeof mapPropsToDispatch>;

export default connect(null, mapPropsToDispatch)(withRouter(RasterAlarmForm));