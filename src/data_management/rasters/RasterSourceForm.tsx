import React from 'react';
// import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { createRasterSource, patchRasterSource } from '../../api/rasters';
import { CheckBox } from './../../form/CheckBox';
import { DurationField } from './../../form/DurationField';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { Button } from '../../form/Button';
import { SelectBox } from '../../form/SelectBox';
import { getOrganisations, getSelectedOrganisation } from '../../reducers';
import styles from './RasterForm.module.css';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { AccessModifier } from '../../form/AccessModifier';
import { RasterSource } from '../../api/rasters';
import { rasterIntervalStringServerToDurationObject, toISOValue } from '../../utils/isoUtils';

interface Props {
  currentRasterSource?: RasterSource
};

const RasterSourceForm: React.FC<Props> = ({ currentRasterSource }) => {
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const initialValues = currentRasterSource ? {
    name: currentRasterSource.name,
    description: currentRasterSource.description,
    supplierCode: currentRasterSource.supplier_code,
    supplierName: currentRasterSource.supplier,
    temporal: currentRasterSource.temporal,
    interval: currentRasterSource.interval ? toISOValue(rasterIntervalStringServerToDurationObject(currentRasterSource.interval)) : '',
    accessModifier: currentRasterSource.access_modifier,
    organisation: currentRasterSource.organisation.uuid.replace(/-/g, "") || null,
  } : {
    name: '',
    description: '',
    supplierCode: '',
    supplierName: '',
    temporal: false,
    interval: '',
    accessModifier: 'Private',
    organisation: selectedOrganisation.uuid.replace(/-/g, "") || null,
  };

  const onSubmit = (values: Values) => {
    console.log('submitted', values);
    // 

    if (!currentRasterSource) {
      const rasterSource = {
        name: values.name as string,
        organisation: values.organisation as string,
        access_modifier: values.accessModifier as string,
        description: values.description as string,
        supplier: values.supplierName as string,
        supplier_code: values.supplierCode as string,
        temporal: values.temporal as boolean,
        interval: values.interval as string,
      };
      // @ts-ignore
      createRasterSource(rasterSource);
    } else {
      const body = {
        name: values.name as string,
        organisation: values.organisation as string,
        access_modifier: values.accessModifier as string,
        description: values.description as string,
        supplier: values.supplierName as string,
        supplier_code: values.supplierCode as string,
        temporal: values.temporal as boolean,
        interval: values.interval as string,
      };
      // @ts-ignore
      patchRasterSource(currentRasterSource.uuid as string, body);
    }
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
        <div>RASTERS</div>
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
          placeholder={'Enter at least 1 character'}
          value={values.description as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.description as string)}
          errorMessage={minLength(1, values.description as string)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'FTP / Supplier code'}
          name={'supplierCode'}
          placeholder={'Enter at least 1 characters'}
          value={values.supplierCode as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.supplierCode as string)}
          errorMessage={minLength(1, values.supplierCode as string)}
          triedToSubmit={triedToSubmit}
        />
        <h3>2: DATA</h3>
        <CheckBox
          title={'Temporal'}
          name={'temporal'}
          value={values.temporal as boolean}
          valueChanged={handleInputChange}
        />
        <DurationField
          name={'interval'}
          value={values.interval as string}
          valueChanged={(value) => handleValueChange('interval', value)}
          validated={true}
          readOnly={values.temporal === false}
        />
        <h3>3: RIGHTS</h3>
        <AccessModifier
          title={'Access Modifier'}
          name={'accessModifier'}
          value={values.accessModifier as string}
          valueChanged={(value) => handleValueChange('accessModifier', value)}
        />
        <SelectBox
          title={'Organisation'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={values.organisation as string}
          valueChanged={(value) => handleValueChange('organisation', value)}
          choices={organisations.map((organisation: any) => [organisation.uuid, organisation.name])}
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

export default RasterSourceForm; 