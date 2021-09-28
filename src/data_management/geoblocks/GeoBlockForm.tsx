import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { SelectDropdown } from '../../form/SelectDropdown';
import { FormButton } from '../../form/FormButton';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { AccessModifier } from '../../form/AccessModifier';
import { useForm, Values } from '../../form/useForm';
import { getSelectedOrganisation,   getLayercollections } from '../../reducers';
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
import GeoBlockBuildModal from './GeoBlockBuildModal';
import geoblockIcon from "../../images/geoblock.svg";
import formStyles from './../../styles/Forms.module.css';
import { rasterLayerFromAPIBelongsToScenario } from '../../api/rasters';
import { FormattedMessage } from 'react-intl';


interface Props {
  currentRecord?: any,
};

const backUrl = "/management/data_management/geoblocks";

const GeoBlockForm: React.FC<Props & DispatchProps & RouteComponentProps> = (props) => {
  const { currentRecord } = props;
  const layercollections = useSelector(getLayercollections).available;
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
    accessModifier: currentRecord.access_modifier,
    supplier: currentRecord.supplier ? convertToSelectObject(currentRecord.supplier) : null,
  } : {
    name: null,
    description: null,
    layercollections: [],
    source: {},
    aggregationType: null,
    observationType: null,
    accessModifier: 'Private',
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
      access_modifier: values.accessModifier,
      supplier: values.supplier && values.supplier.label,
      organisation: selectedOrganisation.uuid,
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
          props.addNotification('Success! Geo Block updated', 2000);
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
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
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
            form={"raster_layer_form_id"}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : null}
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <FormButton
          name={'geoBlockBuildModal'}
          title={'Geo Block *'}
          text={'Geo Block Builder'}
          onClick={e => {
            e.preventDefault();
            setBuildModal(true);
          }}
          validated={!geoblockSourceValidator(values.source)}
          errorMessage={geoblockSourceValidator(values.source)}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          isAsync
          isCached
          loadOptions={fetchObservationTypes}
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
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/management/data_management/geoblocks'}
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
            />
          </div>
        </div>
      </form>
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
          source={values.source}
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