import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
// import { createRasterSource } from '../../api/rasters';
import { CheckBox } from './../../form/CheckBox';
import { DurationField } from './../../form/DurationField';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { Button } from '../../form/Button';
import { getSelectedOrganisation } from '../../reducers';
import styles from './RasterForm.module.css';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { AccessModifier } from '../../form/AccessModifier';

interface Props {};

const RasterSourceForm: React.FC<Props> = ({}) => {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const initialValues = {
    rasterName: '',
    description: '',
    supplierCode: '',
    supplierName: 'hoan.phung',
    temporal: false,
    interval: '',
    accessModifier: 'Private',
    organisation: selectedOrganisation.name,
  };
  const onSubmit = (values: Values) => {
    console.log('submitted', values);
    // const raster = {
    //   name: values.rasterName as string,
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
          name={'rasterName'}
          placeholder={'Enter at least 3 characters'}
          value={values.rasterName as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.rasterName as string)}
          errorMessage={minLength(3, values.rasterName as string)}
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
          readOnly
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

export default RasterSourceForm; 