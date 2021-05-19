import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { getSelectedOrganisation } from '../../../reducers';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { TextInput } from './../../../form/TextInput';
import { SubmitButton } from '../../../form/SubmitButton';
import { CancelButton } from '../../../form/CancelButton';
import { useForm, Values } from '../../../form/useForm';
import { geometryValidator, minLength } from '../../../form/validators';
import { addNotification, removeLocation, updateLocation } from '../../../actions';
import formStyles from './../../../styles/Forms.module.css';
// import { TextArea } from '../../../form/TextArea';
import LocationIcon from "../../../images/locations_icon.svg";
import { AccessModifier } from '../../../form/AccessModifier';
import { AssetPointSelection } from '../../../form/AssetPointSelection';
import { locationFormHelpText } from '../../../utils/help_texts/helpTextsForLocations';
import Modal from '../../../components/Modal';


interface Props {
  currentRecord?: any;
  relatedAsset?: any;
};
interface RouteParams {
  uuid: string;
};

const LocationForm = (props:Props & DispatchProps & RouteComponentProps<RouteParams>) => {
  const { currentRecord, relatedAsset } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [locationCreatedModal, setLocationCreatedModal] = useState<boolean>(false);

  let initialValues;
  if (currentRecord) {
    const geometryCurrentRecord = (
      currentRecord && 
      currentRecord.geometry && 
      currentRecord.geometry.coordinates && 
      currentRecord.geometry.coordinates[1] !== undefined && 
      currentRecord.geometry.coordinates[0] !== undefined &&
      {
        lat: currentRecord.geometry.coordinates[1],
        lng: currentRecord.geometry.coordinates[0],
      }
    );

    initialValues = {
      name: currentRecord.name,
      code: currentRecord.code || '',
      extraMetadata: currentRecord.extra_metadata ? JSON.stringify(currentRecord.extra_metadata) : null,
      accessModifier: currentRecord.access_modifier,
      selectedAsset: {
        asset: relatedAsset && currentRecord.object && currentRecord.object.type && currentRecord.object.id ? {
          value: relatedAsset.id,
          label: relatedAsset.name || relatedAsset.code,
          type: currentRecord.object.type
        } : null,
        location: geometryCurrentRecord ? geometryCurrentRecord : null,
      }
    };
  } else {
    initialValues = {
      name: null,
      code: null,
      extraMetadata: null,
      accessModifier: 'Private',
      selectedAsset: {
        asset: null,
        location: null,
      },
    };
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      code: values.code,
      // extra_metadata: values.extraMetadata,
      access_modifier: values.accessModifier,
      geometry: values.selectedAsset && geometryValidator(values.selectedAsset.location) ? {
        "type":"Point",
        "coordinates": [values.selectedAsset.location.lng, values.selectedAsset.location.lat, 0.0]
      } : null,
      object: {
        id: values.selectedAsset.asset ? values.selectedAsset.asset.value : null,
        type: values.selectedAsset.asset ? values.selectedAsset.asset.type : null
      }
    };
    if (currentRecord) {
      fetch(`/api/v4/locations/${currentRecord.uuid}/`, {
        credentials: 'same-origin',
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })
        .then(data => {
          const status = data.status;
          if (status === 200) {
            props.addNotification('Success! Location updated', 2000);
            props.history.push('/data_management/timeseries/locations');
          } else {
            props.addNotification(status, 2000);
            console.error(data);
          };
        })
        .catch(console.error);
    } else {
      fetch(`/api/v4/locations/`, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...body,
          organisation: selectedOrganisation.uuid
        })
      })
        .then(response => {
          const status = response.status;
          if (status === 201) {
            // props.addNotification('Success! Location creatd', 2000);
            // props.history.push('/data_management/timeseries/locations');
            setLocationCreatedModal(true);
            return response.json();
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          };
        })
        .then(parsedRes => {
          props.updateLocation(parsedRes);
        })
        .catch(console.error);
    };
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
      imgUrl={LocationIcon}
      imgAltDescription={"Location icon"}
      headerText={"Locations"}
      explanationText={locationFormHelpText[fieldOnFocus] || locationFormHelpText['default']}
      backUrl={"/data_management/timeseries/locations"}
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
          title={'Location name *'}
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
        {currentRecord ? (
          <TextInput
            title={'UUID'}
            name={'uuid'}
            value={currentRecord.uuid}
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
        <AssetPointSelection
          value={values.selectedAsset}
          valueChanged={value => handleValueChange('selectedAsset', value)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {/* <TextArea
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
        /> */}
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
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/data_management/timeseries/locations'}
          />
          <SubmitButton
            onClick={tryToSubmitForm}
          />
        </div>
      </form>
      {locationCreatedModal ? (
        <Modal
          title={'Location created'}
          buttonConfirmName={'Continue'}
          onClickButtonConfirm={() => props.history.push('/data_management/timeseries/timeseries/new')}
          cancelAction={() => {
            props.removeLocation();
            props.history.push('/data_management/timeseries/locations');
          }}
        >
          <p>A new location has been created.</p>
          <p>You can choose to add a new time series to the location or go back to the location list.</p>
        </Modal>
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
  updateLocation: (location: any) => dispatch(updateLocation(location)),
  removeLocation: () => dispatch(removeLocation()),
});
type DispatchProps = ReturnType<typeof mapPropsToDispatch>;

export default connect(null, mapPropsToDispatch)(withRouter(LocationForm));