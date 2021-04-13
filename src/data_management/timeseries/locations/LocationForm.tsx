import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { getSelectedOrganisation } from '../../../reducers';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { TextInput } from './../../../form/TextInput';
import { SubmitButton } from '../../../form/SubmitButton';
import { CancelButton } from '../../../form/CancelButton';
import { useForm, Values } from '../../../form/useForm';
import { jsonValidator, minLength } from '../../../form/validators';
import { addNotification } from '../../../actions';
import formStyles from './../../../styles/Forms.module.css';
import { TextArea } from '../../../form/TextArea';
import { GeometryField } from '../../../form/GeometryField';
import LocationIcon from "../../../images/locations_icon.svg";
// import { convertToSelectObject } from '../../../utils/convertToSelectObject';
import { AccessModifier } from '../../../form/AccessModifier';
import MapSelectAssetOrPoint from '../../../form/MapSelectAssetOrPoint';
import { locationFormHelpText } from '../../../utils/help_texts/helpTextsForLocations';


interface Props {
  currentRecord?: any;
};
interface RouteParams {
  uuid: string;
};

const LocationForm = (props:Props & DispatchProps & RouteComponentProps<RouteParams>) => {
  const { currentRecord } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);

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
      name: currentRecord.name || '',
      code: currentRecord.code || '',
      extraMetadata: currentRecord.extra_metadata ? JSON.stringify(currentRecord.extra_metadata) : null,
      accessModifier: currentRecord.access_modifier,
      selectedAsset: {
        asset: currentRecord.object && currentRecord.object.type && currentRecord.object.id ? {
          value: currentRecord.object.id,
          label: currentRecord.code,
          id: currentRecord.object.id,
          code: currentRecord.code,
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
    }
  }

  const onSubmit = (values: Values) => {
    if (currentRecord) {
      const body = {
        name: values.name,
        organisation: selectedOrganisation.uuid,
        code: values.code,
        extra_metadata: values.extraMetadata,
        access_modifier: values.accessModifier,
        supplier: values.supplier,
        geometry: {
          "type":"Point",
          "coordinates":[values.selectedAsset.location.lng,values.selectedAsset.location.lat,0.0]
        },
        object: 
          // it was set by the dropdown
          values.selectedAsset.asset && values.selectedAsset.asset.value.entity_name? 
          {
            type: values.selectedAsset.asset.value.entity_name,
            id: values.selectedAsset.asset.value.entity_id,
          }
          // it was set when loading the form and not changed by the dropdown
          : values.selectedAsset.asset ?
          {
            type: currentRecord.object.type,
            id: currentRecord.object.id, 
          } : // it is empty eather because it iwas made empty by the user or because it was already empty when loaded
          {
            type: null,
            id: null, 
          },
      };
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
            props.history.push('/data_management/timeseries/locations/');
          } else {
            props.addNotification(status, 2000);
            console.error(data);
          };
        })
        .catch(console.error);
    } else {
      const body = {
        name: values.name,
        organisation: selectedOrganisation.uuid,
        code: values.code,
        extra_metadata: values.extraMetadata,
        access_modifier: values.accessModifier,
        supplier: values.supplier,
        geometry: {
          "type":"Point",
          "coordinates":[values.selectedAsset.location.lng,values.selectedAsset.location.lat,0.0]
        },
        object: 
          values.selectedAsset.asset && values.selectedAsset.asset.value? 
          {
            type: values.selectedAsset.asset.value.entity_name,
            id: values.selectedAsset.asset.value.entity_id,
          }:
          {
            type: null,
            id: null,
          },
      };
  
      fetch(`/api/v4/locations/`, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })
        .then(data => {
          const status = data.status;
          if (status === 201) {
            props.addNotification('Success! Location creatd', 2000);
            props.history.push('/data_management/timeseries/locations/');
          } else {
            props.addNotification(status, 2000);
            console.error(data);
          };
        })
        .catch(console.error);
    }
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
          title={'Location name'}
          name={'name'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Code'}
          name={'code'}
          value={values.code}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        {/*  This fields adds nothing for now. Comment it out 
        TODO: make sure that below field is added to the search query in asset selection
        */}
        {/* <SelectDropdown
          title={'Asset type'}
          name={'asset_type'}
          placeholder={'- Search and select -'}
          value={selectedAssetType}
          valueChanged={valueObj => { 
            // TODO: remove this ts ignore
            // @ts-ignore
            setSelectedAssetType (valueObj);
          }}
          options={assetTypeOptions}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        /> */}
        <MapSelectAssetOrPoint
          title={'Asset location'}
          name={'selectedAsset'}
          value={values.selectedAsset}
          valueChanged={value => handleValueChange('selectedAsset', value)}
          validated
          triedToSubmit={triedToSubmit}
        />
        <div style={{display: "flex"}}>
          <div style={{width: "58%", marginRight: "40px"}}>
            <GeometryField
              title={'Geometry'}
              name={'selectedAsset'}
              value={values.selectedAsset}
              valueChanged={(value)=>handleValueChange('selectedAsset', value)}
              validated={true}
              triedToSubmit={triedToSubmit}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label
              className={formStyles.Label}
            >
              <span className={formStyles.LabelTitle}>
                Selected asset
              </span>
              <a 
                href={
                  values.selectedAsset.asset && 
                  values.selectedAsset.asset.value &&  
                  values.selectedAsset.asset.value.entity_name ? 
                  `/api/v3/${values.selectedAsset.asset.value.entity_name}s/${values.selectedAsset.asset.value.entity_id}`
                  : values.selectedAsset.asset?
                  `/api/v3/${currentRecord.object.type}s/${currentRecord.object.id}`
                  :
                  '/api/v3/'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {values.selectedAsset.asset? values.selectedAsset.asset.label : "None selected. See all endpoints" }
              </a>
            </label>
          </div>
        </div>
        <TextArea
          title={'Extra metadata (JSON)'}
          name={'extraMetadata'}
          placeholder={'Enter valid JSON'}
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
          title={'Accessibility'}
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
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapPropsToDispatch>;

export default connect(null, mapPropsToDispatch)(withRouter(LocationForm));