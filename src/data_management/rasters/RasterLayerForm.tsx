import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { FormattedMessage } from "react-intl.macro";
import { connect, useSelector } from 'react-redux';
import {
  createRasterLayer,
  fetchRasterSourcesV4,
  fetchRasterSourceV4,
  patchRasterLayer,
  RasterLayerFromAPI,
  rasterLayerFromAPIBelongsToScenario,
} from '../../api/rasters';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { CheckBox } from './../../form/CheckBox';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { SelectDropdown } from '../../form/SelectDropdown';
import { FormButton } from './../../form/FormButton';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { AccessModifier } from '../../form/AccessModifier';
import ColorMapInput from '../../form/ColorMapInput';
import { useForm, Values } from '../../form/useForm';
import { minLength, required } from '../../form/validators';
import {
  getOrganisations,
  getRasterSourceUUID,
  getSelectedOrganisation,
} from '../../reducers';
import { optionsHasLayers } from '../../utils/rasterOptionFunctions';
import { getUuidFromUrl } from '../../utils/getUuidFromUrl';
import { rasterLayerFormHelpText } from '../../utils/help_texts/helpTextForRasters';
import { addNotification, removeRasterSourceUUID } from './../../actions';
import rasterLayerIcon from "../../images/raster_layer_icon.svg";
import formStyles from './../../styles/Forms.module.css';
import FormActionButtons from '../../components/FormActionButtons';
import DeleteModal from '../../components/DeleteModal';
import { RasterSourceModal } from './RasterSourceModal';
import { convertToSelectObject } from '../../utils/convertToSelectObject';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import { fetchSuppliers } from './RasterSourceForm';
import { baseUrl } from './RasterLayerTable';
import { UUID_REGEX } from '../../components/Breadcrumbs';

interface Props {
  currentRecord?: RasterLayerFromAPI,
};

// Helper function to fetch paginated raster sources with search query
export const fetchRasterSources = async (uuid: string, searchQuery: string) => {
  const params=[`organisation__uuid=${uuid}`, "scenario__isnull=true", "page_size=20"];

  if (searchQuery) {
    if (UUID_REGEX.test(searchQuery)) {
      params.push(`uuid=${searchQuery}`);
    } else {
      params.push(`name__icontains=${searchQuery}`);
    };
  };

  const urlQuery = params.join('&');
  const response = await fetchRasterSourcesV4(urlQuery);

  return response.results.map((rasterSource: any) => convertToSelectObject(rasterSource.uuid, rasterSource.name));
};

// Helper function to fetch paginated layer collections with search query
export const fetchLayerCollections = async (searchQuery: string) => {
  const urlQuery = searchQuery ? `?page_size=20&writable=true&slug__icontains=${searchQuery}` : '?page_size=20&writable=true';
  const response = await fetch(
    `/api/v4/layercollections/${urlQuery}`
  );
  const responseJSON = await response.json();

  return responseJSON.results.map((layerCollection: any) => convertToSelectObject(layerCollection.slug));
};

// Helper function to fetch paginated observation types with search query
export const fetchObservationTypes = async (searchQuery: string) => {
  const urlQuery = searchQuery ? `?page_size=20&code__icontains=${searchQuery}` : '?page_size=20';
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

// Helper function to fetch paginated organisations with search query
export const fetchOrganisationsToShareWith = async (searchQuery: string) => {
  const params=["page_size=20"];

  if (searchQuery) {
    if (UUID_REGEX.test(searchQuery)) {
      params.push(`uuid=${searchQuery}`);
    } else {
      params.push(`name__icontains=${searchQuery}`);
    };
  };

  const urlQuery = params.join('&');
  const response = await fetch(`/api/v4/organisations/?${urlQuery}`);
  const responseJSON = await response.json();

  return responseJSON.results.map((org: any) => convertToSelectObject(org.uuid, org.name));
};

const RasterLayerForm: React.FC<Props & DispatchProps & RouteComponentProps> = (props) => {
  const { currentRecord, removeRasterSourceUUID } = props;
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const rasterSourceUUID = useSelector(getRasterSourceUUID);
  const belongsToScenario = (currentRecord && rasterLayerFromAPIBelongsToScenario(currentRecord)) || false;

  useEffect(() => {
    return () => removeRasterSourceUUID();
  }, [removeRasterSourceUUID]);

  const initialValues = currentRecord ? {
    name: currentRecord.name,
    uuid: currentRecord.uuid,
    description: currentRecord.description,
    layercollections: currentRecord.layer_collections.map(layercollection => convertToSelectObject(layercollection.slug)) || [],
    rasterSource: currentRecord.raster_sources && currentRecord.raster_sources.map(rasterSource => convertToSelectObject(getUuidFromUrl(rasterSource)))[0],
    aggregationType: currentRecord.aggregation_type ? convertToSelectObject(currentRecord.aggregation_type) : null,
    observationType: currentRecord.observation_type ? convertToSelectObject(currentRecord.observation_type.id, currentRecord.observation_type.code) : null,
    colorMap: {options: currentRecord.options, rescalable: currentRecord.rescalable, customColormap: currentRecord.colormap || {}},
    sharedWith: currentRecord.shared_with.length === 0 ? false : true,
    organisationsToSharedWith: currentRecord.shared_with.map(organisation => convertToSelectObject(organisation.uuid, organisation.name)) || [],
    organisation: currentRecord.organisation ? convertToSelectObject(currentRecord.organisation.uuid, currentRecord.organisation.name) : null,
    supplier: currentRecord.supplier ? convertToSelectObject(currentRecord.supplier) : null,
  } : {
    name: null,
    description: null,
    layercollections: [],
    rasterSource: rasterSourceUUID ? convertToSelectObject(rasterSourceUUID) : null,
    aggregationType: null,
    observationType: null,
    colorMap: {options: {}, rescalable: true, customColormap: {}},
    sharedWith: false,
    organisationsToSharedWith: [],
    organisation: selectedOrganisation ? convertToSelectObject(selectedOrganisation.uuid, selectedOrganisation.name) : null,
    supplier: null,
  };
  const onSubmit = (values: Values) => {
    if (!currentRecord) {
      const rasterLayer = {
        name: values.name,
        organisation: values.organisation && values.organisation.value,
        access_modifier: accessModifier || 'Private',
        description: values.description,
        observation_type: values.observationType && values.observationType.value,
        supplier: values.supplier && values.supplier.label,
        aggregation_type: values.aggregationType && values.aggregationType.value,
        options: values.colorMap && values.colorMap.options,
        colormap: JSON.stringify(values.colorMap.customColormap) ==="{}"? undefined : values.colorMap.customColormap,
        rescalable: values.colorMap && values.colorMap.rescalable,
        shared_with: values.sharedWith ? values.organisationsToSharedWith.map((organisation: any) => organisation.value) : [],
        layer_collections: values.layercollections.map((data: any) => data.value)
      };

      createRasterLayer(rasterLayer, values.rasterSource.value)
        .then(response => {
          const status = response.status;
          if (status === 201) {
            props.addNotification('Success! Raster layer created', 2000);
            // redirect back to the table of raster layers
            props.history.push('/management/data_management/rasters/layers');
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
        access_modifier: accessModifier || 'Private',
        description: values.description,
        observation_type: values.observationType && values.observationType.value,
        supplier: values.supplier && values.supplier.label,
        aggregation_type: values.aggregationType && values.aggregationType.value,
        options: values.colorMap && values.colorMap.options,
        colormap: JSON.stringify(values.colorMap.customColormap) ==="{}"? undefined : values.colorMap.customColormap,
        rescalable: values.colorMap && values.colorMap.rescalable,
        shared_with: values.sharedWith ? values.organisationsToSharedWith.map((organisation: any) => organisation.value) : [],
        layer_collections: values.layercollections.map((layercollection: any) => layercollection.value)
      };
      // only add colormap in options if not multiple layers
      if (!optionsHasLayers(values.colorMap.options)) {
        body.options = values.colorMap.options;
      };

      patchRasterLayer(currentRecord.uuid as string, body)
        .then(data => {
          const status = data.response.status;
          if (status === 200) {
            props.addNotification('Success! Raster layer updated', 2000);
            // redirect back to the table of raster layers
            props.history.push('/management/data_management/rasters/layers');
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

  // Access Modifier of a raster layer is kept in the react hook state instead of the form state
  // to keep it in sync with new selected raster source in useEffect
  const { rasterSource } = values;
  const [accessModifier, setAccessModifier] = useState<string>(currentRecord ? currentRecord.access_modifier : 'Private');

  useEffect(() => {
    if (!currentRecord && rasterSource) {
      fetchRasterSourceV4(rasterSource.value).then(
        rasterSourceData => setAccessModifier(rasterSourceData.access_modifier || 'Private')
      ).catch(e => console.error(e));
    };
  }, [currentRecord, rasterSource]);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Modal to view connected sources of a layer
  const [rasterSourceModal, setRasterSourceModal] = useState<boolean>(false);

  return (
    <ExplainSideColumn
      imgUrl={rasterLayerIcon}
      imgAltDescription={"Raster-Layer icon"}
      headerText={"Raster Layers"}
      explanationText={rasterLayerFormHelpText[fieldOnFocus] || rasterLayerFormHelpText['default']}
      backUrl={"/management/data_management/rasters/layers"}
      fieldName={fieldOnFocus}
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
        <span className={`${formStyles.FormFieldTitle} ${formStyles.FirstFormFieldTitle}`}>
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
        {currentRecord ? (
          <TextInput
            title={'UUID'}
            name={'uuid'}
            value={values.uuid}
            valueChanged={handleInputChange}
            validated
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly
          />
        ) : null}
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
        {!belongsToScenario ? (
          <SelectDropdown
            title={'Layer collections'}
            name={'layercollections'}
            placeholder={'- Search and select -'}
            value={values.layercollections}
            valueChanged={value => handleValueChange('layercollections', value)}
            options={[]}
            validated
            isMulti
            isAsync
            isCached
            loadOptions={fetchLayerCollections}
            form={"raster_layer_form_id"}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : null}
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        {currentRecord ? (
          <FormButton
            name={'rasterSourceModal'}
            title={'Source'}
            text={'View'}
            onClick={e => {
              e.preventDefault();
              setRasterSourceModal(true);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            validated
          />
        ) : (
          <SelectDropdown
            title={'Source *'}
            name={'rasterSource'}
            placeholder={'- Search and select -'}
            value={values.rasterSource}
            valueChanged={value => handleValueChange('rasterSource', value)}
            options={[]}
            validated={!required('Please select a raster source', values.rasterSource)}
            errorMessage={required('Please select a raster source', values.rasterSource)}
            triedToSubmit={triedToSubmit}
            form={"raster_layer_form_id"}
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly={!!currentRecord || !!rasterSourceUUID}
            isAsync={!rasterSourceUUID && !currentRecord}
            isCached
            loadOptions={searchInput => fetchRasterSources(selectedOrganisation.uuid, searchInput)}
          />
        )}
        {0?<FormattedMessage id="raster_form.aggregation_type_none" defaultMessage="no aggregation" />:null}
        {0?<FormattedMessage id="raster_form.aggregation_type_counts" defaultMessage="area per category" />:null}
        {0?<FormattedMessage id="raster_form.aggregation_type_curve" defaultMessage="cumulative distribution" />:null}
        {0?<FormattedMessage id="raster_form.aggregation_type_sum" defaultMessage="values in the region are summed" />:null}
        {0?<FormattedMessage id="raster_form.aggregation_type_average" defaultMessage="values in the region are averaged" />:null}
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
              subLabel: "no aggregation",
            },
            {
              value: 'counts',
              label: 'counts',
              subLabel: 'area per category',
            },
            {
              value: 'curve',
              label: 'curve',
              subLabel: 'cumulative distribution',
            },
            {
              value: 'sum',
              label: 'sum',
              subLabel: 'values in the region are summed',
            },
            {
              value: 'average',
              label: 'average',
              subLabel: 'values in the region are averaged',
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
          isCached
          loadOptions={fetchObservationTypes}
        />
        <ColorMapInput
          title={'Choose a color map *'}
          name={'colorMap'}
          colorMapValue={values.colorMap}
          valueChanged={(value) => handleValueChange('colorMap', value)}
          validated
          form={"raster_layer_form_id"}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <AccessModifier
          title={'Accessibility *'}
          name={'accessModifier'}
          value={accessModifier}
          valueChanged={value => setAccessModifier(value || 'Private')}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={belongsToScenario}
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
          readOnly={belongsToScenario}
        />
        {values.sharedWith ? (
          <SelectDropdown
            title={'Organisations to share with'}
            name={'organisationsToSharedWith'}
            placeholder={'- Search and select -'}
            value={values.organisationsToSharedWith}
            options={[]}
            valueChanged={value => handleValueChange('organisationsToSharedWith', value)}
            validated
            form={"raster_layer_form_id"}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isMulti
            isAsync
            isCached
            loadOptions={fetchOrganisationsToShareWith}
            readOnly={belongsToScenario}
          />
        ) : null}
        <SelectDropdown
          title={'Organisation *'}
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
          options={[]}
          validated
          isAsync
          isCached
          loadOptions={searchInput => fetchSuppliers(selectedOrganisation.uuid, searchInput)}
          readOnly={!selectedOrganisation.roles.includes('admin') || belongsToScenario}
          dropUp
          onFocus={handleFocus}
          onBlur={handleBlur}
          form={"raster_layer_form_id"}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/management/data_management/rasters/layers'}
            form={"raster_layer_form_id"}
          />
          <div style={{ display: "flex" }}>
            {currentRecord ? (
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
              form={"raster_layer_form_id"}
            />
          </div>
        </div>
      </div>
      {currentRecord && showDeleteModal ? (
        <DeleteModal
          rows={[currentRecord]}
          displayContent={[{name: "name", width: 40}, {name: "uuid", width: 60}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          handleClose={() => setShowDeleteModal(false)}
          tableUrl={'/management/data_management/rasters/layers'}
        />
      ) : null}
      {currentRecord && currentRecord.uuid && rasterSourceModal ? (
        <RasterSourceModal
          selectedLayer={currentRecord.uuid}
          closeModal={() => setRasterSourceModal(false)}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  removeRasterSourceUUID: () => dispatch(removeRasterSourceUUID()),
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(withRouter(RasterLayerForm));