import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import { createRasterLayer, fetchRasterSourceV4, patchRasterLayer, RasterLayerFromAPI, RasterSourceFromAPI } from '../../api/rasters';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { CheckBox } from './../../form/CheckBox';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { SelectBox } from '../../form/SelectBox';
import { SlushBucket } from '../../form/SlushBucket';
import { AccessModifier } from '../../form/AccessModifier';
import ColorMapInput, { colorMapValidator } from '../../form/ColorMapInput';
import { useForm, Values } from '../../form/useForm';
import { minLength, required } from '../../form/validators';
import {
  getColorMaps,
  getDatasets,
  getObservationTypes,
  getOrganisations,
  getRasterSourceUUID,
  getSelectedOrganisation,
  getSupplierIds
} from '../../reducers';
import { optionsHasLayers } from '../../utils/rasterOptionFunctions';
import { getUuidFromUrl } from '../../utils/getUuidFromUrl';
import { rasterLayerFormHelpText } from '../../utils/helpTextForForms';
import { addNotification, removeRasterSourceUUID } from './../../actions';
import rasterLayerIcon from "../../images/raster_layer_icon.svg";
import formStyles from './../../styles/Forms.module.css';
import FormActionButtons from '../../components/FormActionButtons';
import ConfirmModal from '../../components/Modal';
import { ModalDeleteContent } from '../../components/ModalDeleteContent'


interface Props {
  currentRasterLayer?: RasterLayerFromAPI,
  rasterSources?: RasterSourceFromAPI[] | null,
};

interface PropsFromDispatch {
  removeRasterSourceUUID: () => void,
  addNotification: (message: string | number, timeout: number) => void,
};

const RasterLayerForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentRasterLayer, rasterSources, removeRasterSourceUUID } = props;
  const supplierIds = useSelector(getSupplierIds).available;
  const organisationsToSharedWith = useSelector(getOrganisations).availableForRasterSharedWith;
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const observationTypes = useSelector(getObservationTypes).available;
  const colorMaps = useSelector(getColorMaps).available;
  const datasets = useSelector(getDatasets).available;
  const rasterSourceUUID = useSelector(getRasterSourceUUID);

  useEffect(() => {
    return () => {
      removeRasterSourceUUID();
    };
  }, [removeRasterSourceUUID]);

  const onDelete = () => {
    const body = {};

    currentRasterLayer && fetch(`/api/v4/rasters/${currentRasterLayer.uuid}/`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(data => {
        const status = data.status;
        if (status === 204) {
          props.addNotification('Success! Raster-layer deleted', 2000);
          props.history.push('/data_management/rasters/layers/');
        } else {
          props.addNotification(status, 2000);
          console.error(data);
        };
      })
      .catch(console.error);
  }

  const initialValues = currentRasterLayer ? {
    name: currentRasterLayer.name,
    description: currentRasterLayer.description,
    dataset: (currentRasterLayer.datasets && currentRasterLayer.datasets[0] && currentRasterLayer.datasets[0].slug) || null,
    rasterSource: (currentRasterLayer.raster_sources && currentRasterLayer.raster_sources[0] && getUuidFromUrl(currentRasterLayer.raster_sources[0])) || null,
    aggregationType: currentRasterLayer.aggregation_type || null,
    observationType: (currentRasterLayer.observation_type && currentRasterLayer.observation_type.id + '') || null,
    colorMap: {options: currentRasterLayer.options, rescalable: currentRasterLayer.rescalable, customColormap: currentRasterLayer.colormap || {}},
    accessModifier: currentRasterLayer.access_modifier,
    sharedWith: currentRasterLayer.shared_with.length === 0 ? false : true,
    organisationsToSharedWith: currentRasterLayer.shared_with.map(organisation => organisation.uuid.replace(/-/g, "")) || [],
    organisation: currentRasterLayer.organisation.uuid.replace(/-/g, "") || null,
    supplier: currentRasterLayer.supplier,
  } : {
    name: null,
    description: null,
    dataset: null,
    rasterSource: rasterSourceUUID || null,
    aggregationType: null,
    observationType: null,
    colorMap: {options: {}, rescalable: true, customColormap: {}},
    sharedWith: false,
    organisationsToSharedWith: [],
    organisation: selectedOrganisation.uuid.replace(/-/g, "") || null,
    supplier: null,
  };
  const onSubmit = (values: Values) => {
    if (!currentRasterLayer) {
      const rasterLayer = {
        name: values.name,
        organisation: values.organisation,
        access_modifier: accessModifier || 'Private',
        description: values.description,
        observation_type: values.observationType,
        supplier: values.supplier,
        aggregation_type: values.aggregationType,
        options: values.colorMap.options,
        colormap: JSON.stringify(values.colorMap.customColormap) ==="{}"? undefined : values.colorMap.customColormap,
        rescalable: values.colorMap.rescalable,
        shared_with: values.organisationsToSharedWith,
        datasets: values.dataset ? [values.dataset] : []
      };

      createRasterLayer(rasterLayer, values.rasterSource)
        .then(response => {
          const status = response.status;
          if (status === 201) {
            props.addNotification('Success! Raster layer created', 2000);
            // redirect back to the table of raster layers
            props.history.push('/data_management/rasters/layers');
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          };
        })
        .catch(e => console.error(e));
    } else {
      const body = {
        name: values.name,
        organisation: values.organisation,
        access_modifier: values.accessModifier,
        description: values.description,
        observation_type: values.observationType,
        supplier: values.supplier,
        aggregation_type: values.aggregationType,
        options: values.colorMap.options,
        colormap: JSON.stringify(values.colorMap.customColormap) ==="{}"? undefined : values.colorMap.customColormap,
        rescalable: values.colorMap.rescalable,
        shared_with: values.organisationsToSharedWith,
        datasets: values.dataset ? [values.dataset] : []
      };
      // only add colormap in options if not multiple layers
      if (!optionsHasLayers(values.colorMap.options)) {
        body.options = values.colorMap.options;
      };

      patchRasterLayer(currentRasterLayer.uuid as string, body)
        .then(data => {
          const status = data.response.status;
          if (status === 200) {
            props.addNotification('Success! Raster layer updated', 2000);
            // redirect back to the table of raster layers
            props.history.push('/data_management/rasters/layers');
          } else {
            props.addNotification(status, 2000);
            console.error(data);
          };
        })
        .catch(e => console.error(e));
    };
  };

  const {
    values,
    triedToSubmit,
    tryToSubmitForm,
    handleInputChange,
    handleValueChange,
    fieldOnFocus,
    handleBlur,
    handleFocus,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  // For Access Modifier of a new Raster Layer, we need to keep it in sync
  // with each new selected raster source by user by using useEffect
  const { rasterSource } = values;
  const [accessModifier, setAccessModifier] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // we keep the showColormapModal state in the raster-layerform.
  // IMO (Tom) keeping it in colormapinput would have been better, but we had to solve this bug:
  // https://github.com/nens/threedi-live-site/issues/861
  const [showColormapModal, setShowColormapModal] = useState(false)


  useEffect(() => {
    if (!currentRasterLayer && rasterSource) {
      fetchRasterSourceV4(rasterSource).then(
        rasterSourceData => setAccessModifier(rasterSourceData.access_modifier || 'Private')
      ).catch(e => console.error(e));
    };
  }, [currentRasterLayer, rasterSource]);

  return (
    <ExplainSideColumn
      imgUrl={rasterLayerIcon}
      imgAltDescription={"Raster-Layer icon"}
      headerText={"Raster Layers"}
      explanationText={rasterLayerFormHelpText[fieldOnFocus] || rasterLayerFormHelpText['default']}
      backUrl={"/data_management/rasters/layers"}
    >
      {/* 
      I also use a form inside the colormap modal.
      A form inside a form is not valid html.
      Therefore I used the workaround here:
      https://stackoverflow.com/questions/3430214/form-inside-a-form-is-that-alright?lq=1
      Answer from user: "ilevent"
      */}
      <form
        // remove this class because it gives element height
        // className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
        id={"raster_layer_form_id"}
      >
      </form>
      <div className={formStyles.Form}>
        <span className={formStyles.FormFieldTitle}>
          1: General
        </span>
        <TextInput
          title={'Name *'}
          name={'name'}
          placeholder={'Please enter at least 3 characters'}
          value={values.name}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
          form={"raster_layer_form_id"}
        />
        <TextArea
          title={'Description'}
          name={'description'}
          placeholder={'This is a layer based on raster_source'}
          value={values.description}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
          form={"raster_layer_form_id"}
        />
        <SelectBox
          title={'Dataset'}
          name={'dataset'}
          placeholder={'- Select -'}
          value={values.dataset}
          valueChanged={value => handleValueChange('dataset', value)}
          choices={datasets.map((dataset: any) => [dataset.slug, dataset.slug])}
          onFocus={handleFocus}
          onBlur={handleBlur}
          validated
          form={"raster_layer_form_id"}
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        {!currentRasterLayer && !rasterSourceUUID && rasterSources ?
          <SelectBox
            title={'Source *'}
            name={'rasterSource'}
            placeholder={'- Search and select -'}
            value={values.rasterSource}
            valueChanged={value => handleValueChange('rasterSource', value)}
            choices={rasterSources.map(rasterSource => [rasterSource.uuid!, rasterSource.name])}
            validated={!required('Please select a raster source', values.rasterSource)}
            errorMessage={required('Please select a raster source', values.rasterSource)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            triedToSubmit={triedToSubmit}
            readOnly={!!currentRasterLayer || !!rasterSourceUUID}
            showSearchField
            form={"raster_layer_form_id"}
          />
          :
          <TextInput
            title={'Source *'}
            name={'rasterSource'}
            value={values.rasterSource}
            valueChanged={handleInputChange}
            clearInput={clearInput}
            validated
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly
            triedToSubmit={triedToSubmit}
            form={"raster_layer_form_id"}
          />
        }
        <SelectBox
          title={'Aggregation type *'}
          name={'aggregationType'}
          placeholder={'- Select -'}
          value={values.aggregationType}
          valueChanged={value => handleValueChange('aggregationType', value)}
          choices={[
            [
              "none",
              "none",
              <FormattedMessage id="raster_form.aggregation_type_none" />
            ],
            [
              "counts",
              "counts",
              <FormattedMessage id="raster_form.aggregation_type_counts" />
            ],
            [
              "curve",
              "curve",
              <FormattedMessage id="raster_form.aggregation_type_curve" />
            ],
            [
              "sum",
              "sum",
              <FormattedMessage id="raster_form.aggregation_type_sum" />
            ],
            [
              "average",
              "average",
              <FormattedMessage id="raster_form.aggregation_type_average" />
            ]
          ]}
          validated={!required('Please select an option', values.aggregationType)}
          errorMessage={required('Please select an option', values.aggregationType)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          triedToSubmit={triedToSubmit}
          form={"raster_layer_form_id"}
        />
        <SelectBox
          title={'Observation type *'}
          name={'observationType'}
          placeholder={'- Search and select -'}
          value={values.observationType}
          valueChanged={value => handleValueChange('observationType', value)}
          choices={observationTypes.map((obsT: any) => {
            let parameterString = obsT.parameter + '';
            if (obsT.unit || obsT.reference_frame) {
              parameterString += ' ('
              if (obsT.unit) {
                parameterString += obsT.unit;
              }
              if (obsT.unit && obsT.reference_frame) {
                parameterString += ' ';
              }
              if (obsT.reference_frame) {
                parameterString += obsT.reference_frame;
              }
              parameterString += ')'
            }
  
            return [obsT.id, obsT.code, parameterString];
          })}
          validated={!required('Please select an observation type', values.observationType)}
          errorMessage={required('Please select an observation type', values.observationType)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          triedToSubmit={triedToSubmit}
          showSearchField
          form={"raster_layer_form_id"}
        />
        <ColorMapInput
          title={<FormattedMessage id="raster_form.colormap" />}
          name={'colorMap'}
          value={values.colorMap}
          valueChanged={value => handleValueChange('colorMap', value)}
          colorMaps={colorMaps.map((colM: any) => [colM.name, colM.name, colM.description])}
          validated={!colorMapValidator(values.colorMap)}
          errorMessage={colorMapValidator(values.colorMap)}
          triedToSubmit={triedToSubmit}
          form={"raster_layer_form_id"}
          onFocus={handleFocus}
          onBlur={handleBlur}
          setShowCustomColormapModal={setShowColormapModal}
          showCustomColormapModal={showColormapModal}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <AccessModifier
          title={'Accessibility'}
          name={'accessModifier'}
          value={values.accessModifier || accessModifier}
          valueChanged={() => null}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
          form={"raster_layer_form_id"}
        />
        <CheckBox
          title={'Shared with other organisations'}
          name={'sharedWith'}
          value={values.sharedWith}
          valueChanged={bool => handleValueChange('sharedWith', bool)}
          form={"raster_layer_form_id"}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {values.sharedWith ? (
          <SlushBucket
            title={'Organisations'}
            name={'organisationsToSharedWith'}
            placeholder={'Search organisations'}
            value={values.organisationsToSharedWith}
            choices={organisationsToSharedWith.map((organisation: any) => {
              return {
                display: organisation.name,
                value: organisation.uuid
              }
            })}
            valueChanged={(value: any) => handleValueChange('organisationsToSharedWith', value)}
            validated
            form={"raster_layer_form_id"}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : null}
        <SelectBox
          title={'Organisation'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={values.organisation}
          valueChanged={value => handleValueChange('organisation', value)}
          choices={organisations.map((organisation: any) => [organisation.uuid, organisation.name])}
          showSearchField
          validated={values.organisation !== null && values.organisation !== ''}
          errorMessage={'Please select an organisation'}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
          form={"raster_layer_form_id"}
        />
        <SelectBox
          title={'Supplier'}
          name={'supplier'}
          placeholder={'- Search and select -'}
          value={values.supplier}
          valueChanged={value => handleValueChange('supplier', value)}
          choices={supplierIds.map((suppl:any) => [suppl.username, suppl.username])}
          showSearchField
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={!(supplierIds.length > 0 && selectedOrganisation.roles.includes('admin'))}
          form={"raster_layer_form_id"}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/data_management/rasters/layers'}
            form={"raster_layer_form_id"}
          />
          <div style={{
            display: "flex"
          }}>
            {currentRasterLayer?
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
              form={"raster_layer_form_id"}
            />
          </div>
          
        </div>
      </div>
      { 
        currentRasterLayer && showDeleteModal?
           <ConfirmModal
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
           
           <p>Are you sure? You are deleting the following raster layer:</p>
           
           {ModalDeleteContent([currentRasterLayer], false, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
           
         </ConfirmModal>
        :
          null
        }
    </ExplainSideColumn>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  removeRasterSourceUUID: () => dispatch(removeRasterSourceUUID()),
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
});

export default connect(null, mapDispatchToProps)(withRouter(RasterLayerForm));