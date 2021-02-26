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
import { fetchRasterLayersV4 } from '../../../api/rasters';
import { convertToSelectObject } from '../../../utils/convertToSelectObject';
import formStyles from './../../../styles/Forms.module.css';
import rasterAlarmIcon from "../../../images/alarm@3x.svg";

interface Props {
  currentRasterAlarm?: any
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
  const { currentRasterAlarm } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const navigationUrl = "/alarms/notifications/raster_alarms";

  const initialValues = currentRasterAlarm ? {
  } : {
  };

  const onSubmit = (values: Values) => {
    const body = {
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
        <TextInput
          title={'name *'}
          name={'name'}
          placeholder={'Please enter at least 1 character'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.name)}
          errorMessage={minLength(1, values.name)}
          triedToSubmit={triedToSubmit}
        />
        <SelectDropdown
          title={'Raster selection *'}
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