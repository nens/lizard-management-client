import React, { useState } from 'react';
// import { FormattedMessage } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { createRasterSource, patchRasterSource } from '../../api/rasters';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { CheckBox } from './../../form/CheckBox';
import { DurationField } from './../../form/DurationField';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { Button } from '../../form/Button';
import { SelectBox } from '../../form/SelectBox';
import { getOrganisations, getSelectedOrganisation } from '../../reducers';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { AccessModifier } from '../../form/AccessModifier';
import { RasterSource } from '../../api/rasters';
import { rasterIntervalStringServerToDurationObject, toISOValue } from '../../utils/isoUtils';
import { updateRasterSourceUUID } from '../../actions';
import rasterIcon from "../../images/raster_layers_logo_explainbar.svg";
import formStyles from './../../styles/Forms.module.css';

interface Props {
  currentRasterSource?: RasterSource
};
interface PropsFromDispatch {
  updateRasterSourceUUID: (uuid: string) => void
};

const RasterSourceForm: React.FC<Props & PropsFromDispatch> = (props) => {
  const { currentRasterSource } = props;
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [successModal, setSuccessModal] = useState<boolean>(false);

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
      createRasterSource(rasterSource).then(
        (response: any) => response.json()
      ).then((parsedBody: any) => {
        console.log('parsedBody', parsedBody);
        setSuccessModal(true);
        props.updateRasterSourceUUID(parsedBody.uuid);
      });
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
    <ExplainSideColumn
      imgUrl={rasterIcon}
      headerText={"Raster Sources"}
      explainationText={"Fill in the form to create a new Raster Source."}
      backUrl={"/data_management/raster_sources"}      
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
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <CheckBox
          title={'Temporal'}
          name={'temporal'}
          value={values.temporal as boolean}
          valueChanged={(bool: boolean) => handleValueChange('temporal', bool)}
        />
        <DurationField
          title={'Interval'}
          name={'interval'}
          value={values.interval as string}
          valueChanged={(value) => handleValueChange('interval', value)}
          validated={true}
          readOnly={values.temporal === false}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
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
      {successModal ? (
        <div>
          <h3>Raster created</h3>
          <p>A layer is needed to view the raster in the portal</p>
          <p>We automatically created a layer for you to compose. You will now be redirected to the layer management</p>
          <NavLink to={'/data_management/raster_layers/new'}>Continue</NavLink>
        </div>
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  updateRasterSourceUUID: (uuid: string) => dispatch(updateRasterSourceUUID(uuid))
});

export default connect(null, mapPropsToDispatch)(RasterSourceForm);