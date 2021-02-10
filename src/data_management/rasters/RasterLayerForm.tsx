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
import { AccessModifier } from '../../form/AccessModifier';
import ColorMapInput, { colorMapValidator } from '../../form/ColorMapInput';
import { useForm, Values } from '../../form/useForm';
import { minLength, required } from '../../form/validators';
import {
  getColorMaps,
  getDatasets,
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
import { SelectDropdown } from '../../form/SelectDropdown';
import { convertToSelectObject } from '../../utils/convertToSelectObject';

interface Props {
  currentRasterLayer?: RasterLayerFromAPI,
  rasterSources?: RasterSourceFromAPI[] | null,
};

interface PropsFromDispatch {
  removeRasterSourceUUID: () => void,
  addNotification: (message: string | number, timeout: number) => void,
};

// Helper function to fetch paginated observation types with search query
const fetchObservationTypes = async (searchQuery: string) => {
  const urlQuery = searchQuery ? `?code__icontains=${searchQuery}` : '';
  const response = await fetch(
    `/api/v4/observationtypes/${urlQuery}`
  );
  const responseJSON = await response.json();

  return responseJSON.results.map((obsT: any) => {
    let parameterString = obsT.parameter + '';

    if (obsT.unit || obsT.reference_frame) {
      parameterString += ' (';
      if (obsT.unit) {
        parameterString += obsT.unit;
      };
      if (obsT.unit && obsT.reference_frame) {
        parameterString += ' ';
      };
      if (obsT.reference_frame) {
        parameterString += obsT.reference_frame;
      };
      parameterString += ')';
    };

    return convertToSelectObject(obsT.id, obsT.code, parameterString);
  });
};

const RasterLayerForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentRasterLayer, rasterSources, removeRasterSourceUUID } = props;
  const supplierIds = useSelector(getSupplierIds).available;
  const organisationsToSharedWith = useSelector(getOrganisations).availableForRasterSharedWith;
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
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
    datasets: currentRasterLayer.datasets.map(dataset => convertToSelectObject(dataset.slug)) || [],
    rasterSource: currentRasterLayer.raster_sources && currentRasterLayer.raster_sources.map(rasterSource => convertToSelectObject(getUuidFromUrl(rasterSource)))[0],
    aggregationType: currentRasterLayer.aggregation_type ? convertToSelectObject(currentRasterLayer.aggregation_type) : null,
    observationType: currentRasterLayer.observation_type ? convertToSelectObject(currentRasterLayer.observation_type.id, currentRasterLayer.observation_type.code) : null,
    colorMap: {options: currentRasterLayer.options, rescalable: currentRasterLayer.rescalable, customColormap: currentRasterLayer.colormap || {}},
    accessModifier: currentRasterLayer.access_modifier,
    sharedWith: currentRasterLayer.shared_with.length === 0 ? false : true,
    organisationsToSharedWith: currentRasterLayer.shared_with.map(organisation => convertToSelectObject(organisation.uuid.replace(/-/g, ""), organisation.name)) || [],
    organisation: currentRasterLayer.organisation ? convertToSelectObject(currentRasterLayer.organisation.uuid.replace(/-/g, ""), currentRasterLayer.organisation.name) : null,
    supplier: currentRasterLayer.supplier ? convertToSelectObject(currentRasterLayer.supplier) : null,
  } : {
    name: null,
    description: null,
    datasets: [],
    rasterSource: rasterSourceUUID ? convertToSelectObject(rasterSourceUUID) : null,
    aggregationType: null,
    observationType: null,
    colorMap: {options: {}, rescalable: true, customColormap: {}},
    sharedWith: false,
    organisationsToSharedWith: [],
    organisation: selectedOrganisation ? convertToSelectObject(selectedOrganisation.uuid.replace(/-/g, ""), selectedOrganisation.name) : null,
    supplier: null,
  };
  const onSubmit = (values: Values) => {
    if (!currentRasterLayer) {
      const rasterLayer = {
        name: values.name,
        organisation: values.organisation && values.organisation.value,
        access_modifier: accessModifier || 'Private',
        description: values.description,
        observation_type: values.observationType && values.observationType.value,
        supplier: values.supplier && values.supplier.value,
        aggregation_type: values.aggregationType && values.aggregationType.value,
        options: values.colorMap && values.colorMap.options,
        colormap: JSON.stringify(values.colorMap.customColormap) ==="{}"? undefined : values.colorMap.customColormap,
        rescalable: values.colorMap && values.colorMap.rescalable,
        shared_with: values.organisationsToSharedWith.map((organisation: any) => organisation.value),
        datasets: values.datasets.map((data: any) => data.value)
      };

      createRasterLayer(rasterLayer, values.rasterSource.value)
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
        organisation: values.organisation && values.organisation.value,
        access_modifier: values.accessModifier,
        description: values.description,
        observation_type: values.observationType && values.observationType.value,
        supplier: values.supplier && values.supplier.value,
        aggregation_type: values.aggregationType && values.aggregationType.value,
        options: values.colorMap && values.colorMap.options,
        colormap: JSON.stringify(values.colorMap.customColormap) ==="{}"? undefined : values.colorMap.customColormap,
        rescalable: values.colorMap && values.colorMap.rescalable,
        shared_with: values.organisationsToSharedWith.map((organisation: any) => organisation.value),
        datasets: values.datasets.map((dataset: any) => dataset.value)
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

  useEffect(() => {
    if (!currentRasterLayer && rasterSource) {
      fetchRasterSourceV4(rasterSource.value).then(
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
        <SelectDropdown
          title={'Dataset'}
          name={'datasets'}
          placeholder={'- Search and select -'}
          value={values.datasets}
          valueChanged={value => handleValueChange('datasets', value)}
          options={datasets.map((dataset: any) => convertToSelectObject(dataset.slug))}
          validated
          isMulti
          form={"raster_layer_form_id"}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <SelectDropdown
          title={'Source *'}
          name={'rasterSource'}
          placeholder={'- Search and select -'}
          value={values.rasterSource}
          valueChanged={value => handleValueChange('rasterSource', value)}
          options={rasterSources ? rasterSources.map(rasterSource => convertToSelectObject(rasterSource.uuid!, rasterSource.name)) : []}
          validated={!required('Please select a raster source', values.rasterSource)}
          errorMessage={required('Please select a raster source', values.rasterSource)}
          triedToSubmit={triedToSubmit}
          form={"raster_layer_form_id"}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={!!currentRasterLayer || !!rasterSourceUUID}
        />
        <SelectDropdown
          title={'Aggregation type *'}
          name={'aggregationType'}
          placeholder={'- Select -'}
          value={values.aggregationType}
          valueChanged={value => handleValueChange('aggregationType', value)}
          options={[
            {
              value: 'none',
              label: 'none',
              subLabel: <FormattedMessage id="raster_form.aggregation_type_none" />
            },
            {
              value: 'counts',
              label: 'counts',
              subLabel: <FormattedMessage id="raster_form.aggregation_type_counts" />
            },
            {
              value: 'curve',
              label: 'curve',
              subLabel: <FormattedMessage id="raster_form.aggregation_type_curve" />
            },
            {
              value: 'sum',
              label: 'sum',
              subLabel: <FormattedMessage id="raster_form.aggregation_type_sum" />
            },
            {
              value: 'average',
              label: 'average',
              subLabel: <FormattedMessage id="raster_form.aggregation_type_average" />
            }
          ]}
          validated={!!values.aggregationType}
          errorMessage={'Please select an option'}
          triedToSubmit={triedToSubmit}
          form={"raster_layer_form_id"}
          onFocus={handleFocus}
          onBlur={handleBlur}
          isSearchable={false}
        />
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
          form={"raster_layer_form_id"}
          onFocus={handleFocus}
          onBlur={handleBlur}
          isAsync
          loadOptions={fetchObservationTypes}
        />
        <ColorMapInput
          title={<FormattedMessage id="raster_form.colormap" />}
          name={'colorMap'}
          colorMapValue={values.colorMap}
          valueChanged={value => handleValueChange('colorMap', value)}
          colorMaps={colorMaps.map((colM: any) => convertToSelectObject(colM.name, colM.name, colM.description))}
          validated={!colorMapValidator(values.colorMap)}
          errorMessage={colorMapValidator(values.colorMap)}
          triedToSubmit={triedToSubmit}
          form={"raster_layer_form_id"}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          <SelectDropdown
            title={'Organisations'}
            name={'organisationsToSharedWith'}
            placeholder={'- Search and select -'}
            value={values.organisationsToSharedWith}
            options={organisationsToSharedWith.map((organisation: any) => convertToSelectObject(organisation.uuid, organisation.name))}
            valueChanged={value => handleValueChange('organisationsToSharedWith', value)}
            validated
            form={"raster_layer_form_id"}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isMulti
          />
        ) : null}
        <SelectDropdown
          title={'Organisation'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={values.organisation}
          valueChanged={value => handleValueChange('organisation', value)}
          options={organisations.map((organisation: any) => convertToSelectObject(organisation.uuid, organisation.name))}
          validated={values.organisation !== null && values.organisation !== ''}
          errorMessage={'Please select an organisation'}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
          form={"raster_layer_form_id"}
        />
        <SelectDropdown
          title={'Supplier'}
          name={'supplier'}
          placeholder={'- Search and select -'}
          value={values.supplier}
          valueChanged={value => handleValueChange('supplier', value)}
          options={supplierIds.map((suppl:any) => convertToSelectObject(suppl.username))}
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