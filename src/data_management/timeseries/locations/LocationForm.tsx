import React, {useState,} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
// import { getOrganisations, getUsername } from '../../reducers';
import { getSelectedOrganisation, /*getSupplierIds*/ } from '../../../reducers';
// import { ScenarioResult } from '../../form/ScenarioResult';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { TextInput } from './../../../form/TextInput';
import { SubmitButton } from '../../../form/SubmitButton';
import { CancelButton } from '../../../form/CancelButton';
import { useForm, Values } from '../../../form/useForm';
import { minLength, /*jsonValidator, */ /*required*/ } from '../../../form/validators';
import { addNotification } from '../../../actions';
import formStyles from './../../../styles/Forms.module.css';
// import { TextArea } from '../../../form/TextArea';
import {GeometryField} from '../../../form/GeometryField';
import LocationIcon from "../../../images/locations_icon.svg";
import FormActionButtons from '../../../components/FormActionButtons';
import Modal from '../../../components/Modal';
import { ModalDeleteContent } from '../../../components/ModalDeleteContent';
// import { lableTypeFormHelpText } from '../../utils/helpTextForForms';
import { convertToSelectObject } from '../../../utils/convertToSelectObject';
// import { SelectDropdown } from '../../../form/SelectDropdown';
import { AccessModifier } from '../../../form/AccessModifier';
import MapSelectAssetOrPoint from '../../../form/MapSelectAssetOrPoint';
import {locationFormHelpText} from '../../../utils/help_texts/helpTextsForLocations';


interface Props {
  currentRecord?: any;
  relatedAsset?: any;
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};
interface RouteParams {
  uuid: string;
};

const LocationFormModel = (props:Props & PropsFromDispatch & RouteComponentProps<RouteParams>) => {
  const { currentRecord, relatedAsset } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // we need this later
  // const assetTypeOptions = [
  //   {
  //     value: "measuring_station",
  //     label: "Measuringstation",
  //     subLabel: "(Default)",
  //     subLabel2: undefined,
  //   },
  //   {
  //     value: "pump_station",
  //     label: "Pumpstation",
  //     subLabel: undefined,
  //     subLabel2: undefined,
  //   },
  // ];
  // We need this later
  // const [selectedAssetType, setSelectedAssetType] = useState(assetTypeOptions[0]);
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  // Need this later if we support supplier ids
  // const supplierIds = useSelector(getSupplierIds).available;

  // Need this later if we support organisations
  // const organisations = useSelector(getOrganisations).available;
  // next line doesnot work, because organisation has no uuid, but unique_id instead. Thus I do not use it
  // const thisRecordOrganisation = organisations.find((org: any) => org.uuid === currentRecord.organisation.uuid.replace(/-/g, ""));
  // const username = useSelector(getUsername);

  let initialValues;
  
  if (currentRecord) {

    const geometryCurrentRecord = 
      currentRecord && 
      currentRecord.geometry && 
      currentRecord.geometry.coordinates && 
      currentRecord.geometry.coordinates[1] !== undefined && 
      currentRecord.geometry.coordinates[0] !== undefined &&
      {
        lat: currentRecord.geometry.coordinates[1],
        lng: currentRecord.geometry.coordinates[0],
      };
    const geometryRelatedAsset = 
      relatedAsset && 
      relatedAsset.view && 
      relatedAsset.view[1] !== undefined && 
      relatedAsset.view[0] !== undefined &&
      {
        lat: relatedAsset.view[1],
        lng: relatedAsset.view[0],
      };


    initialValues = {
      name: currentRecord.name || '',
      code: currentRecord.code || '',
      extraMetadata: currentRecord.extra_metadata,
      accessModifier: currentRecord.access_modifier,
      supplier: currentRecord.supplier ? convertToSelectObject(currentRecord.supplier) :  null,
      // object: currentRecord.object,
      selectedAssetObj: {
        location: geometryCurrentRecord? geometryCurrentRecord : geometryRelatedAsset? geometryRelatedAsset: null,
        asset: relatedAsset?convertToSelectObject(relatedAsset, relatedAsset.code): null,
      }
      // uuid: currentRecord.uuid || '',
      // description: currentRecord.description || '',
      // modelName: currentRecord.model_name || '',
      // supplier: currentRecord.username || '',
      // organisation: (currentRecord.location && currentRecord.location.organisation && currentRecord.location.organisation.name) || '',
    };
  } else {
    initialValues = {
      name: null,
      code: null,
      extraMetadata: null,
      accessModifier: 'Private',
      supplier: null,
      // object: {
      //   type: null,
      //   id: null,
      // },
      selectedAssetObj: {
        location: null,
        asset: null,
      }
      // description: null,
      // modelName: currentRecord.model_name || '',
      // supplier: currentRecord.username || '',
      // organisation: selectedOrganisation ? convertToSelectObject(selectedOrganisation.uuid.replace(/-/g, ""), selectedOrganisation.name) : null,
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
          "coordinates":[values.selectedAssetObj.location.lng,values.selectedAssetObj.location.lat,0.0]
        },
        object: 
          // it was set by the dropdown
          values.selectedAssetObj.asset && values.selectedAssetObj.asset.value.entity_name? 
          {
            type: values.selectedAssetObj.asset.value.entity_name,
            id: values.selectedAssetObj.asset.value.entity_id,
          }
          // it was set when loading the form and not changed by the dropdown
          : values.selectedAssetObj.asset ?
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
          "coordinates":[values.selectedAssetObj.location.lng,values.selectedAssetObj.location.lat,0.0]
        },
        object: 
          values.selectedAssetObj.asset && values.selectedAssetObj.asset.value? 
          {
            type: values.selectedAssetObj.asset.value.entity_name,
            id: values.selectedAssetObj.asset.value.entity_id,
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

  const onDelete = () => {
    const body = {};

    fetch(`/api/v4/locations/${currentRecord.uuid}/`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(data => {
        const status = data.status;
        if (status === 204) {
          props.addNotification('Success! Location deleted', 2000);
          props.history.push('/data_management/timeseries/locations/');
        } else {
          props.addNotification(status, 2000);
          console.error(data);
        };
      })
      .catch(console.error);
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
          name={'selectedAssetObj'}
          // placeholder={'- Search and select -'}
          value={values.selectedAssetObj}
          valueChanged={(value)=>handleValueChange('selectedAssetObj', value)}
          validated={true}
          triedToSubmit={triedToSubmit}
        />
       
        
        <div style={{display: "flex"}}>
          <div style={{width: "58%", marginRight: "40px"}}>
            <GeometryField
              title={'Geometry'}
              name={'selectedAssetObj'}
              // placeholder={'- Search and select -'}
              value={values.selectedAssetObj}
              valueChanged={(value)=>handleValueChange('selectedAssetObj', value)}
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
                  values.selectedAssetObj.asset && 
                  values.selectedAssetObj.asset.value &&  
                  values.selectedAssetObj.asset.value.entity_name ? 
                  `/api/v3/${values.selectedAssetObj.asset.value.entity_name}s/${values.selectedAssetObj.asset.value.entity_id}`
                  : values.selectedAssetObj.asset?
                  `/api/v3/${currentRecord.object.type}s/${currentRecord.object.id}`
                  :
                  '/api/v3/'
                }
              >
                {values.selectedAssetObj.asset? values.selectedAssetObj.asset.label : "None selected. See all endpoints" }
              </a>
            </label>
          </div>
        </div>
       
        {/* <TextArea
          title={'Extra metadata (JSON) *'}
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
        /> */}
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
        {/* <SelectDropdown
          title={'Supplier'}
          name={'supplier'}
          placeholder={'- Search and select -'}
          value={values.supplier}
          valueChanged={value => handleValueChange('supplier', value)}
          options={supplierIds.map((suppl:any) => convertToSelectObject(suppl.username))}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={(!(supplierIds.length > 0 && selectedOrganisation.roles.includes('admin')))}
        /> */}
        {/* <TextInput
          title={'Label type Uuid'}
          name={'uuid'}
          value={values.uuid}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.uuid)}
          errorMessage={minLength(3, values.uuid)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
        <TextArea
          title={'Description'}
          name={'description'}
          placeholder={'Description here..'}
          value={values.description}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
        <TextInput
          title={'Organisation'}
          name={'organisation'}
          value={values.organisation}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        /> */}
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/data_management/timeseries/locations'}
          />
          <div style={{
            display: "flex"
          }}>
            {currentRecord?
             <div style={{marginRight: "16px"}}> 
              <FormActionButtons
                actions={[
                  {
                    displayValue: "Delete",
                    actionFunction: () => {setShowDeleteModal(true)}
                  },
                ]}
              />
            </div>
            :null}
            <SubmitButton
              onClick={tryToSubmitForm}
            />
          </div>
        </div>
      </form>
      { 
        currentRecord && showDeleteModal?
           <Modal
           title={'Are you sure?'}
           buttonConfirmName={'Delete'}
           onClickButtonConfirm={() => {
              onDelete();
              setShowDeleteModal(false);
           }}
           cancelAction={()=>{
            setShowDeleteModal(false)
          }}
          disableButtons={false}
         >
           
           <p>Are you sure? You are deleting the following Location:</p>
           
           {ModalDeleteContent([currentRecord], false, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
           
         </Modal>
        :
          null
        }
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

const LocationForm = connect(null, mapPropsToDispatch)(withRouter(LocationFormModel));

export { LocationForm  };