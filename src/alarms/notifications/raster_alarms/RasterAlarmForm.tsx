import React from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { TextInput } from './../../../form/TextInput';
import { RasterPointSelection } from '../../../form/RasterPointSelection';
import { SelectDropdown } from '../../../form/SelectDropdown';
import { CheckBox } from '../../../form/CheckBox';
import { RelativeField } from '../../../form/RelativeField';
import { AlarmThresholds } from '../../../form/AlarmThresholds';
import { Message, Recipients } from '../../../form/Recipients';
import { IntegerInput } from '../../../form/IntegerInput';
import { SubmitButton } from '../../../form/SubmitButton';
import { CancelButton } from '../../../form/CancelButton';
import { useForm, Values } from '../../../form/useForm';
import { minLength, relativeEndValidator, required } from '../../../form/validators';
import { addNotification } from '../../../actions';
import { getSelectedOrganisation } from '../../../reducers';
import { fetchRasterLayersV4, RasterLayerFromAPI } from '../../../api/rasters';
import { convertToSelectObject } from '../../../utils/convertToSelectObject';
import { convertDurationObjToSeconds } from '../../../utils/dateUtils';
import { rasterIntervalStringServerToDurationObject } from '../../../utils/isoUtils';
import { getUuidFromUrl } from '../../../utils/getUuidFromUrl';
import { rasterAlarmFormHelpText } from '../../../utils/help_texts/helpTextForAlarms';
import formStyles from './../../../styles/Forms.module.css';
import rasterAlarmIcon from "../../../images/alarm@3x.svg";

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
    point: currentRasterAlarm.geometry ? {lat: currentRasterAlarm.geometry.coordinates[1], lng: currentRasterAlarm.geometry.coordinates[0]} : null, // point in format of {lat: number, lng: number}
    relative: !!currentRasterAlarm.relative_start || !!currentRasterAlarm.relative_end,
    relativeStart: currentRasterAlarm.relative_start ? convertDurationObjToSeconds(rasterIntervalStringServerToDurationObject(currentRasterAlarm.relative_start)) : null,
    relativeEnd: currentRasterAlarm.relative_end ? convertDurationObjToSeconds(rasterIntervalStringServerToDurationObject(currentRasterAlarm.relative_end)) : null,
    snoozeOn: currentRasterAlarm.snooze_sign_on,
    snoozeOff: currentRasterAlarm.snooze_sign_off,
    comparison: convertToSelectObject(currentRasterAlarm.comparison),
    thresholds: currentRasterAlarm.thresholds,
    messages: currentRasterAlarm.messages.map((message: any) => {
      const groupId = parseInt(getUuidFromUrl(message.contact_group));
      const templateId = parseInt(getUuidFromUrl(message.message));
      return {
        contact_group: convertToSelectObject(groupId),
        message: convertToSelectObject(templateId)
      };
    })
  } : {
    name: null,
    raster: null,
    point: null,
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
      active: true,
      name: values.name,
      raster: values.raster.value,
      geometry: {
        type: "Point",
        coordinates: [values.point.lng, values.point.lat, 0.0]
      },
      relative_start: values.relative ? values.relativeStart : null,
      relative_end: values.relative ? values.relativeEnd : null,
      comparison: values.comparison.value,
      thresholds: values.thresholds,
      snooze_sign_on: values.snoozeOn,
      snooze_sign_off: values.snoozeOff,
      messages: values.messages.map((message: Message) => ({
        contact_group: message.contact_group.value,
        message: message.message.value
      }))
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
      fetch(`/api/v4/rasteralarms/${currentRasterAlarm.uuid}/`, {
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
    fieldOnFocus,
    handleBlur,
    handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={rasterAlarmIcon}
      imgAltDescription={"Raster alarm icon"}
      headerText={"Raster alarms"}
      explanationText={rasterAlarmFormHelpText[fieldOnFocus] || rasterAlarmFormHelpText['default']}
      backUrl={"/alarms/notifications/raster_alarms"}
      fieldName={fieldOnFocus}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          isAsync
          isCached
          loadOptions={searchInput => fetchRasterLayers(selectedOrganisation.uuid, searchInput)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <RasterPointSelection
          title={'Map location *'}
          name={'point'}
          rasterUuid={values.raster ? values.raster.value : null}
          point={values.point}
          valueChanged={value => handleValueChange('point', value)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <CheckBox
          title={'Limit to relative period'}
          name={'relative'}
          value={values.relative}
          valueChanged={bool => handleValueChange('relative', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {values.relative ? (
          <div className={formStyles.GridContainer}>
            <RelativeField
              title={'Relative start'}
              name={'relativeStart'}
              value={values.relativeStart}
              valueChanged={value => handleValueChange('relativeStart', value)}
              validated
              readOnly={!values.relative}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <RelativeField
              title={'Relative end'}
              name={'relativeEnd'}
              value={values.relativeEnd}
              valueChanged={value => handleValueChange('relativeEnd', value)}
              validated={!relativeEndValidator(values.relativeStart, values.relativeEnd)}
              errorMessage={relativeEndValidator(values.relativeStart, values.relativeEnd)}
              triedToSubmit={triedToSubmit}
              readOnly={!values.relative}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        ) : null}
        <SelectDropdown
          title={'Alarm thresholds *'}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <AlarmThresholds
          title={'Threshold values *'}
          name={'thresholds'}
          comparison={values.comparison.value}
          thresholds={values.thresholds}
          valueChanged={threshold => handleValueChange('thresholds', [...values.thresholds, threshold])}
          valueRemoved={thresholds => handleValueChange('thresholds', thresholds)}
          validated={values.thresholds.length > 0}
          errorMessage={'Please add at least one threshold to the alarm'}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <label
          className={formStyles.Label}
        >
          <span className={formStyles.LabelTitle}>
            Snoozing *
          </span>
          <div className={formStyles.GridContainer}>
            <IntegerInput
              title={'Triggered after N times'}
              name={'snoozeOn'}
              value={values.snoozeOn}
              valueChanged={handleInputChange}
              validated={values.snoozeOn >= 1}
              errorMessage={'Please ensure this value is greater than or equal to 1'}
              triedToSubmit={triedToSubmit}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <IntegerInput
              title={'Withdrawn after N times'}
              name={'snoozeOff'}
              value={values.snoozeOff}
              valueChanged={handleInputChange}
              validated={values.snoozeOff >= 1}
              errorMessage={'Please ensure this value is greater than or equal to 1'}
              triedToSubmit={triedToSubmit}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </label>
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <Recipients
          title={'Recipients'}
          name={'messages'}
          organisation={currentRasterAlarm ? currentRasterAlarm.organisation.uuid : selectedOrganisation.uuid}
          messages={values.messages}
          valueChanged={recipients => handleValueChange('messages', recipients)}
          valueRemoved={recipients => handleValueChange('messages', recipients)}
          validated
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
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