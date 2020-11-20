import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import { createRasterLayer, patchRasterLayer, RasterLayer, RasterSource } from '../../api/rasters';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { CheckBox } from './../../form/CheckBox';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { SelectBox } from '../../form/SelectBox';
import { SlushBucket } from '../../form/SlushBucket';
import { AccessModifier } from '../../form/AccessModifier';
import ColorMapInput, { ColorMapOptions, colorMapValidator } from '../../form/ColorMapInput';
import { useForm, Values } from '../../form/useForm';
import { minLength, required } from '../../form/validators';
import {
  getColorMaps,
  getDatasets,
  getObservationTypes,
  getOrganisations,
  getRasterSourceUUID,
  getSelectedOrganisation
} from '../../reducers';
import { optionsHasLayers } from '../../utils/rasterOptionFunctions';
import { getUuidFromUrl } from '../../utils/getUuidFromUrl';
import { addNotification, removeRasterSourceUUID } from './../../actions';
import rasterIcon from "../../images/raster_layers_logo_explainbar.svg";
import formStyles from './../../styles/Forms.module.css';

interface Props {
  currentRasterLayer?: RasterLayer,
  rasterSources?: RasterSource[] | null,
};

interface PropsFromDispatch {
  removeRasterSourceUUID: () => void,
  addNotification: (message: string | number, timeout: number) => void,
};

const RasterLayerForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentRasterLayer, rasterSources, removeRasterSourceUUID } = props;
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

  const initialValues = currentRasterLayer ? {
    name: currentRasterLayer.name,
    description: currentRasterLayer.description,
    dataset: (currentRasterLayer.datasets && currentRasterLayer.datasets[0]) || null,
    rasterSource: (currentRasterLayer.raster_sources && currentRasterLayer.raster_sources[0] && getUuidFromUrl(currentRasterLayer.raster_sources[0])) || null,
    aggregationType: currentRasterLayer.aggregation_type || null,
    observationType: (currentRasterLayer.observation_type && currentRasterLayer.observation_type.id + '') || null,
    colorMap: {options: currentRasterLayer.options, rescalable: currentRasterLayer.rescalable},
    accessModifier: currentRasterLayer.access_modifier,
    sharedWith: currentRasterLayer.shared_with.length === 0 ? false : true,
    organisationsToSharedWith: currentRasterLayer.shared_with.map(organisation => organisation.uuid.replace(/-/g, "")) || [],
    organisation: currentRasterLayer.organisation.uuid.replace(/-/g, "") || null,
    supplierName: currentRasterLayer.supplier,
  } : {
    name: null,
    description: null,
    dataset: null,
    rasterSource: rasterSourceUUID || null,
    aggregationType: null,
    observationType: null,
    colorMap: null,
    accessModifier: 'Private',
    sharedWith: false,
    organisationsToSharedWith: [],
    organisation: selectedOrganisation.uuid.replace(/-/g, "") || null,
    supplierName: null,
  };
  const onSubmit = (values: Values) => {
    console.log('submitted', values);

    if (!currentRasterLayer) {
      const rasterLayer = {
        name: values.name as string,
        organisation: values.organisation as string,
        access_modifier: values.accessModifier as string,
        description: values.description as string,
        observation_type: values.observationType as string,
        supplier: values.supplierName as string,
        aggregation_type: values.aggregationType as string,
        // @ts-ignore
        options: values.colorMap.options,
        // @ts-ignore
        rescalable: values.colorMap.rescalable as boolean,
        shared_with: values.organisationsToSharedWith as string[],
        datasets: [values.dataset as string],
      };

      createRasterLayer(rasterLayer, values.rasterSource as string)
        .then(response => {
          const status = response.status;
          props.addNotification(status, 2000);
          if (status === 201) {
            // redirect back to the table of raster layers
            props.history.push('/data_management/raster_layers');
          } else {
            console.error(response);
          };
        })
        .catch(e => console.error(e));
    } else {
      const body = {
        name: values.name as string,
        organisation: values.organisation as string,
        access_modifier: values.accessModifier as string,
        description: values.description as string,
        observation_type: values.observationType as string,
        supplier: values.supplierName as string,
        aggregation_type: values.aggregationType as string,
        // @ts-ignore
        options: values.colorMap.options,
        // @ts-ignore
        rescalable: values.colorMap.rescalable as boolean,
        shared_with: values.organisationsToSharedWith as string[],
        // datasets: [values.dataset as string]
      };
      // only add colormap in options if not multiple layers
      // @ts-ignore
      if (!optionsHasLayers(values.colorMap.options)) {
        // @ts-ignore
        body.options = values.colorMap.options;
      };

      patchRasterLayer(currentRasterLayer.uuid as string, body)
        .then(data => {
          const status = data.response.status;
          props.addNotification(status, 2000);
          if (status === 200) {
            // redirect back to the table of raster layers
            props.history.push('/data_management/raster_layers');
          } else {
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
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={rasterIcon}
      headerText={"Raster Layers"}
      explainationText={"Create a layer to view your raster data in the portal."}
      backUrl={"/data_management/raster_layers"}
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
          placeholder={'Please enter at least 3 characters'}
          value={values.name as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name as string)}
          errorMessage={minLength(3, values.name as string)}
          triedToSubmit={triedToSubmit}
        />
        <TextArea
          title={'Description'}
          name={'description'}
          placeholder={'This is a layer based on raster_source'}
          value={values.description as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
        />
        <SelectBox
          title={'Dataset'}
          name={'dataset'}
          placeholder={'- Select -'}
          value={values.dataset as string}
          valueChanged={value => handleValueChange('dataset', value)}
          choices={datasets.map((dataset: any) => [dataset.slug, dataset.slug])}
          validated
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        {!currentRasterLayer && !rasterSourceUUID && rasterSources ?
          <SelectBox
            title={'Source *'}
            name={'rasterSource'}
            placeholder={'- Search and select -'}
            value={values.rasterSource as string}
            valueChanged={value => handleValueChange('rasterSource', value)}
            choices={rasterSources.map(rasterSource => [rasterSource.uuid!, rasterSource.name])}
            validated={!required('Please select a raster source', values.rasterSource)}
            errorMessage={required('Please select a raster source', values.rasterSource)}
            triedToSubmit={triedToSubmit}
            readOnly={!!currentRasterLayer || !!rasterSourceUUID}
            showSearchField
          />
          :
          <TextInput
            title={'Source *'}
            name={'rasterSource'}
            value={values.rasterSource as string}
            valueChanged={handleInputChange}
            clearInput={clearInput}
            validated
            readOnly
            triedToSubmit={triedToSubmit}
          />
        }
        <SelectBox
          title={'Aggregation type *'}
          name={'aggregationType'}
          placeholder={'- Select -'}
          value={values.aggregationType as string}
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
          triedToSubmit={triedToSubmit}
        />
        <SelectBox
          title={'Observation type *'}
          name={'observationType'}
          placeholder={'- Search and select -'}
          value={values.observationType as string}
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
          triedToSubmit={triedToSubmit}
          showSearchField
        />
        <ColorMapInput
          title={<FormattedMessage id="raster_form.colormap" />}
          name={'colorMap'}
          value={values.colorMap as ColorMapOptions}
          valueChanged={value => handleValueChange('colorMap', value)}
          colorMaps={colorMaps.map((colM: any) => [colM.name, colM.name, colM.description])}
          validated={!colorMapValidator(values.colorMap as ColorMapOptions)}
          errorMessage={colorMapValidator(values.colorMap as ColorMapOptions)}
          triedToSubmit={triedToSubmit}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <AccessModifier
          title={'Access Modifier'}
          name={'accessModifier'}
          value={values.accessModifier as string}
          valueChanged={value => handleValueChange('accessModifier', value)}
          readOnly
        />
        <CheckBox
          title={'Shared with other organisations'}
          name={'sharedWith'}
          value={values.sharedWith as boolean}
          valueChanged={bool => handleValueChange('sharedWith', bool)}
        />
        {values.sharedWith ? (
          <SlushBucket
            title={'Organisations'}
            name={'organisationsToSharedWith'}
            placeholder={'Search organisations'}
            value={values.organisationsToSharedWith as string[]}
            choices={organisationsToSharedWith.map((organisation: any) => {
              return {
                display: organisation.name,
                value: organisation.uuid
              }
            })}
            valueChanged={(value: any) => handleValueChange('organisationsToSharedWith', value)}
            validated
          />
        ) : null}
        <SelectBox
          title={'Organisation'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={values.organisation as string}
          valueChanged={value => handleValueChange('organisation', value)}
          choices={organisations.map((organisation: any) => [organisation.uuid, organisation.name])}
          validated
          readOnly
        />
        <TextInput
          title={'Supplier'}
          name={'supplier'}
          value={values.supplierName as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/data_management/raster_layers'}
          />
          <SubmitButton
            onClick={tryToSubmitForm}
          />
        </div>
      </form>
    </ExplainSideColumn>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  removeRasterSourceUUID: () => dispatch(removeRasterSourceUUID()),
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
});

export default connect(null, mapDispatchToProps)(withRouter(RasterLayerForm));