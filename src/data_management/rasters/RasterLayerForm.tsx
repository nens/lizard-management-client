import React from 'react';
// import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
// import { createRasterSource } from '../../api/rasters';
import { CheckBox } from './../../form/CheckBox';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { Button } from '../../form/Button';
import {
  getColorMaps,
  getDatasets,
  getObservationTypes,
  getOrganisations,
  getSelectedOrganisation
} from '../../reducers';
import styles from './RasterForm.module.css';
import { useForm, Values } from '../../form/useForm';
import { minLength, required } from '../../form/validators';
import { AccessModifier } from '../../form/AccessModifier';
import { Select } from '../../form/Select';
import { Dropdown } from '../../form/Dropdown';
import { RasterLayer } from '../../api/rasters';

interface Props {
  currentRasterLayer?: RasterLayer
};

const RasterLayerForm: React.FC<Props> = ({ currentRasterLayer }) => {
  const organisationsToSharedWith = useSelector(getOrganisations).availableForRasterSharedWith;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const observationTypes = useSelector(getObservationTypes).available;
  const colorMaps = useSelector(getColorMaps).available;
  const datasets = useSelector(getDatasets).available;

  const initialValues = currentRasterLayer ? {
    name: currentRasterLayer.name,
    description: currentRasterLayer.description,
    dataset: currentRasterLayer.datasets[0] || '',
    rasterSource: currentRasterLayer.raster_sources[0] || '',
    aggregationType: currentRasterLayer.aggregation_type,
    observationType: currentRasterLayer.observation_type,
    // @ts-ignore
    colorMap: currentRasterLayer.options.styles,
    rescalable: currentRasterLayer.rescalable,
    colorMapMin: '',
    colorMapMax: '',
    accessModifier: currentRasterLayer.access_modifier,
    sharedWith: currentRasterLayer.shared_with.length === 0 ? false : true,
    organisations: currentRasterLayer.shared_with.map(organisation => organisation.name).join(', '),
    organisation: currentRasterLayer.organisation.name,
    supplierName: currentRasterLayer.supplier,
  } : {
    name: '',
    description: '',
    dataset: '',
    rasterSource: '',
    aggregationType: '',
    observationType: '',
    colorMap: '',
    rescalable: false,
    colorMapMin: '',
    colorMapMax: '',
    accessModifier: 'Private',
    sharedWith: false,
    organisations: '',
    organisation: selectedOrganisation.name,
    supplierName: 'hoan.phung',
  };
  const onSubmit = (values: Values) => {
    console.log('submitted', values);
    // const raster = {
    //   name: values.name as string,
    //   organisation: values.organisation as string,
    //   access_modifier: values.accessModifier as string,
    //   description: values.description as string,
    //   supplier: values.supplierName as string,
    //   supplier_code: values.supplierCode as string,
    //   temporal: values.temporal as boolean,
    //   interval: values.interval as string,
    // };
    // createRasterSource(raster);
  };

  const {
    values,
    triedToSubmit,
    tryToSubmitForm,
    handleInputChange,
    handleSubmit,
    handleReset,
    clearInput,
    handleValueChange,
  } = useForm({initialValues, onSubmit});

  return (
    <div>
      <div>
        <div>LAYERS</div>
        <div>EXPLAIN BOX</div>
      </div>
      <form
        className={styles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <h3>1: GENERAL</h3>
        <TextInput
          title={'Name*'}
          name={'name'}
          placeholder={'Enter at least 3 characters'}
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
        <Dropdown
          title={'Dataset'}
          name={'dataset'}
          value={values.dataset as string}
          valueChanged={handleInputChange}
          options={datasets.map((dataset: any) => dataset.slug)}
          placeholder={'- Search and select -'}
          validated={true}
        />
        <h3>2: DATA</h3>
        <TextInput
          title={'Source*'}
          name={'rasterSource'}
          value={values.rasterSource as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly
          triedToSubmit={triedToSubmit}
        />
        <Select
          title={'Aggregation type'}
          name={'aggregationType'}
          placeholder={'- Select -'}
          value={values.aggregationType as string}
          valueChanged={handleInputChange}
          options={['none', 'counts', 'curve', 'sum', 'aggregate']}
          validated={!required('Please select an option', values.aggregationType)}
          errorMessage={required('Please select an option', values.aggregationType)}
          triedToSubmit={triedToSubmit}
        />
        <Dropdown
          title={'Observation type'}
          name={'observationType'}
          value={values.observationType as string}
          valueChanged={handleInputChange}
          options={observationTypes.map((obsType: any) => obsType.parameter)}
          placeholder={'- Search and select -'}
          validated={!required('Please select an observation type', values.observationType)}
          errorMessage={required('Please select an observation type', values.observationType)}
          triedToSubmit={triedToSubmit}
        />
        <Dropdown
          title={'Color map'}
          name={'colorMap'}
          value={values.colorMap as string}
          valueChanged={handleInputChange}
          options={colorMaps.map((colorMap: any) => colorMap.name)}
          placeholder={'- Search and select -'}
          validated={!required('Please select a color map', values.colorMap)}
          errorMessage={required('Please select a color map', values.colorMap)}
          triedToSubmit={triedToSubmit}
        />
        <h3>3: RIGHTS</h3>
        <AccessModifier
          title={'Access Modifier'}
          name={'accessModifier'}
          value={values.accessModifier as string}
          valueChanged={(value) => handleValueChange('accessModifier', value)}
          readOnly
        />
        <CheckBox
          title={'Shared with other organisations'}
          name={'sharedWith'}
          value={values.sharedWith as boolean}
          valueChanged={handleInputChange}
        />
        <Dropdown
          title={'Organisations'}
          name={'organisations'}
          value={values.organisations as string}
          valueChanged={handleInputChange}
          options={organisationsToSharedWith.map((organisation: any) => organisation.name)}
          placeholder={'- Search and select -'}
          validated={!required('Please select an organisation', values.organisations)}
          errorMessage={required('Please select an organisation', values.organisations)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Organisation'}
          name={'organisation'}
          value={values.organisation as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          readOnly
        />
        <TextInput
          title={'Supplier'}
          name={'supplier'}
          value={values.supplierName as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          readOnly
        />
        <div>
          <Button
            type='reset'
          />{' '}
          <Button
            type='submit'
            onClick={tryToSubmitForm}
          />
        </div>
      </form>
    </div>
  );
};

export default RasterLayerForm;