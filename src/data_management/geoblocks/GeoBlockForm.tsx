import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { CheckBox } from './../../form/CheckBox';
import { SelectDropdown } from '../../form/SelectDropdown';
import ColorMapInput, { colorMapValidator } from '../../form/ColorMapInput';
import { FormButton } from '../../form/FormButton';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { AccessModifier } from '../../form/AccessModifier';
import { useForm, Values } from '../../form/useForm';
import { getSelectedOrganisation,   getLayercollections, getOrganisations } from '../../reducers';
import { addNotification } from './../../actions';
import { convertToSelectObject } from '../../utils/convertToSelectObject';
import { fetchSuppliers } from '../rasters/RasterSourceForm';
import { fetchObservationTypes } from '../rasters/RasterLayerForm';
import { geoblockSourceValidator, minLength, required } from '../../form/validators';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import { geoBlockHelpText } from '../../utils/help_texts/helpTextForGeoBlock';
import { baseUrl } from '../rasters/RasterLayerTable';
import FormActionButtons from '../../components/FormActionButtons';
import DeleteModal from '../../components/DeleteModal';
import GeoBlockBuildModal from './buildComponents/GeoBlockBuildModal';
import geoblockIcon from "../../images/geoblock.svg";
import formStyles from './../../styles/Forms.module.css';
import { rasterLayerFromAPIBelongsToScenario } from '../../api/rasters';
import { FormattedMessage } from 'react-intl';
import { fetchOrganisationsToShareWith } from '../rasters/RasterLayerForm';


interface Props {
  currentRecord?: any,
};

const backUrl = "/management/data_management/geoblocks";

const GeoBlockForm: React.FC<Props & DispatchProps & RouteComponentProps> = (props) => {
  const { currentRecord } = props;
  const layercollections = useSelector(getLayercollections).available;
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const belongsToScenario = (currentRecord && rasterLayerFromAPIBelongsToScenario(currentRecord)) || false;


  const [buildModal, setBuildModal] = useState<boolean>(false);

  const initialValues = currentRecord ? {
    name: currentRecord.name,
    uuid: currentRecord.uuid,
    description: currentRecord.description,
    layercollections: currentRecord.layer_collections.map((layercollection: {slug: string}) => convertToSelectObject(layercollection.slug)) || [],
    source: currentRecord.source,
    aggregationType: currentRecord.aggregation_type ? convertToSelectObject(currentRecord.aggregation_type) : null,
    observationType: currentRecord.observation_type ? convertToSelectObject(currentRecord.observation_type.id, currentRecord.observation_type.code) : null,
    colorMap: {options: currentRecord.options, rescalable: currentRecord.rescalable, customColormap: currentRecord.colormap || {}},
    accessModifier: currentRecord.access_modifier,
    sharedWith: currentRecord.shared_with.length === 0 ? false : true,
    organisationsToSharedWith: currentRecord.shared_with.map((organisation:any) => convertToSelectObject(organisation.uuid, organisation.name)) || [],
    organisation: currentRecord.organisation ? convertToSelectObject(currentRecord.organisation.uuid, currentRecord.organisation.name) : null,
    supplier: currentRecord.supplier ? convertToSelectObject(currentRecord.supplier) : null,
  } : {
    name: null,
    description: null,
    layercollections: [],
    source: null,
    aggregationType: null,
    observationType: null,
    colorMap: {options: {}, rescalable: true, customColormap: {}},
    accessModifier: 'Private',
    sharedWith: false,
    organisationsToSharedWith: [],
    organisation: selectedOrganisation ? convertToSelectObject(selectedOrganisation.uuid, selectedOrganisation.name) : null,
    supplier: null,
  };
  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      description: values.description,
      layer_collections: values.layercollections.map((data: any) => data.value),
      source: values.source,
      aggregation_type: values.aggregationType && values.aggregationType.value,
      observation_type: values.observationType && values.observationType.value,
      options: values.colorMap && values.colorMap.options,
      colormap: JSON.stringify(values.colorMap.customColormap) ==="{}"? undefined : values.colorMap.customColormap,
      rescalable: values.colorMap && values.colorMap.rescalable,
      access_modifier: values.accessModifier,
      shared_with: values.sharedWith ? values.organisationsToSharedWith.map((organisation: any) => organisation.value) : [],
      supplier: values.supplier && values.supplier.label,
      organisation: values.organisation && values.organisation.value,
    };
    if (!currentRecord) {
      fetch(baseUrl, {
        credentials: 'same-origin',
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).then(response => {
        const status = response.status;
        if (status === 201) {
          props.addNotification('Success! New GeoBlock created', 2000);
          props.history.push(backUrl);
        } else if (status === 403) {
          props.addNotification("Not authorized", 2000);
          console.error(response);
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        };
      }).catch(console.error);
    } else {
      fetch(`/api/v4/rasters/${currentRecord.uuid}/`, {
        credentials: 'same-origin',
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).then(response => {
        const status = response.status;
        if (status === 200) {
          props.addNotification('Success! GeoBlock updated', 2000);
          props.history.push(backUrl);
        } else if (status === 403) {
          props.addNotification("Not authorized", 2000);
          console.error(response);
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        };
      }).catch(console.error);
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

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <ExplainSideColumn
      imgUrl={geoblockIcon}
      imgAltDescription={"GeoBlock icon"}
      headerText={"GeoBlocks"}
      explanationText={geoBlockHelpText[fieldOnFocus] || geoBlockHelpText['default']}
      backUrl={"/management/data_management/geoblocks"}
      fieldName={fieldOnFocus}
    >
      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        id={"geoblock_form_id"}
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
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
          form={"geoblock_form_id"}
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
          value={values.description}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
          form={"geoblock_form_id"}
        />
        {!belongsToScenario ? (
          <SelectDropdown
            title={'Layer collections'}
            name={'layercollections'}
            placeholder={'- Search and select -'}
            value={values.layercollections}
            valueChanged={value => handleValueChange('layercollections', value)}
            options={layercollections.map((layercollection: any) => convertToSelectObject(layercollection.slug))}
            validated
            isMulti
            form={"geoblock_form_id"}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : null}
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
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
          form={"geoblock_form_id"}
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
          form={"geoblock_form_id"}
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
          valueChanged={value => handleValueChange('colorMap', value)}
          validated
          form={"geoblock_form_id"}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <FormButton
          name={'geoBlockBuildModal'}
          title={'GeoBlock *'}
          text={'GeoBlock Builder'}
          onClick={e => {
            e.preventDefault();
            setBuildModal(true);
          }}
          validated={!geoblockSourceValidator(values.source)}
          errorMessage={geoblockSourceValidator(values.source)}
          readOnly={
            // required fields must be filled in first
            !(values.name && values.name.length >= 3) ||
            !values.aggregationType ||
            !values.observationType ||
            !colorMapValidator(values.colorMap).validated
          }
          readOnlyTooltip={'Please first fill in the required fields.'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          form={"geoblock_form_id"}
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
          readOnly={belongsToScenario}
          form={"geoblock_form_id"}
        />
        <CheckBox
          title={'Shared with other organisations'}
          name={'sharedWith'}
          value={values.sharedWith}
          valueChanged={bool => handleValueChange('sharedWith', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={belongsToScenario}
          form={"geoblock_form_id"}
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
            onFocus={handleFocus}
            onBlur={handleBlur}
            isMulti
            isAsync
            isCached
            loadOptions={fetchOrganisationsToShareWith}
            readOnly={belongsToScenario}
            form={"geoblock_form_id"}
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
          readOnly
          form={"geoblock_form_id"}
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
          readOnly={!selectedOrganisation.roles.includes('admin')}
          dropUp
          onFocus={handleFocus}
          onBlur={handleBlur}
          form={"geoblock_form_id"}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/management/data_management/geoblocks'}
            form={"geoblock_form_id"}
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
              form={"geoblock_form_id"}
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
      {buildModal ? (
        <GeoBlockBuildModal
          uuid={currentRecord ? currentRecord.uuid : null}
          formValues={values}
          source={values.source}
          operations={currentRecord ? currentRecord.weight : null}
          onChange={value => handleValueChange('source', value)}
          handleClose={() => setBuildModal(false)}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(withRouter(GeoBlockForm));