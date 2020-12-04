import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { createRasterSource, patchRasterSource, RasterSourceFromAPI } from '../../api/rasters';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { CheckBox } from './../../form/CheckBox';
import { DurationField } from './../../form/DurationField';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { SelectBox } from '../../form/SelectBox';
import { AcceptedFile, UploadRasterData } from './../../form/UploadRasterData';
import ConfirmModal from '../../components/ConfirmModal';
import { getOrganisations, getSelectedOrganisation } from '../../reducers';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { AccessModifier } from '../../form/AccessModifier';
import { rasterIntervalStringServerToDurationObject, toISOValue } from '../../utils/isoUtils';
import { addFilesToQueue, addNotification, updateRasterSourceUUID } from '../../actions';
import rasterSourceIcon from "../../images/raster_source_icon.svg";
import formStyles from './../../styles/Forms.module.css';
import { sendDataToLizardRecursive } from '../../utils/sendDataToLizard';

interface Props {
  currentRasterSource?: RasterSourceFromAPI
};
interface PropsFromDispatch {
  updateRasterSourceUUID: (uuid: string) => void,
  addNotification: (message: string | number, timeout: number) => void,
  addFilesToQueue: (files: File[]) => void,
};
interface RouteParams {
  uuid: string;
};

const RasterSourceForm: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (props) => {
  const { currentRasterSource } = props;
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [rasterCreatedModal, setRasterCreatedModal] = useState<boolean>(false);

  const initialValues = currentRasterSource ? {
    name: currentRasterSource.name,
    description: currentRasterSource.description,
    supplierCode: currentRasterSource.supplier_code,
    supplierName: currentRasterSource.supplier,
    temporal: currentRasterSource.temporal,
    interval: currentRasterSource.interval ? toISOValue(rasterIntervalStringServerToDurationObject(currentRasterSource.interval)) : '',
    accessModifier: currentRasterSource.access_modifier,
    organisation: currentRasterSource.organisation.uuid.replace(/-/g, "") || null,
    data: [],
  } : {
    name: null,
    description: null,
    supplierCode: null,
    supplierName: null,
    temporal: false,
    interval: null,
    accessModifier: 'Private',
    organisation: selectedOrganisation.uuid.replace(/-/g, "") || null,
    data: []
  };

  const onSubmit = (values: Values) => {
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
      createRasterSource(rasterSource)
        .then(response => {
          const status = response.status;
          if (status === 201) {
            setRasterCreatedModal(true);
            return response.json();
          } else {
            console.error(response);
          }
        }).then((parsedBody: any) => {
          props.updateRasterSourceUUID(parsedBody.uuid);
          // Add files to Upload Queue in Redux store
          // add notification and send data to Lizard server
          const acceptedFiles = values.data as AcceptedFile[] || [];
          const uploadFiles = acceptedFiles.map(f => f.file);
          if (uploadFiles.length > 0) props.addNotification('Upload started', 1000);
          props.addFilesToQueue(uploadFiles);
          sendDataToLizardRecursive(
            parsedBody.uuid,
            values.data as AcceptedFile[],
            values.temporal as boolean
          );
        }).catch(e => console.error(e));
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
      patchRasterSource(currentRasterSource.uuid as string, body)
        .then(data => {
          const status = data.response.status;
          if (status === 200) {
            props.addNotification('Success! Raster source updated', 2000);
            // Add files to Upload Queue in Redux store
            // add notification and send data to Lizard server
            const acceptedFiles = values.data as AcceptedFile[] || [];
            const uploadFiles = acceptedFiles.map(f => f.file);
            if (uploadFiles.length > 0) props.addNotification('Upload started', 1000);
            props.addFilesToQueue(uploadFiles);
            sendDataToLizardRecursive(
              props.match.params.uuid,
              values.data as AcceptedFile[],
              values.temporal as boolean
            );
            // redirect back to the table of raster sources
            props.history.push('/data_management/rasters/sources')
          } else {
            props.addNotification(status, 2000);
            console.error(data);
          };
        })
        .catch(e => console.error(e));
    }
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
      imgUrl={rasterSourceIcon}
      headerText={"Raster Sources"}
      explainationText={"Fill in the form to create a new Raster Source."}
      backUrl={"/data_management/rasters/sources"}
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
          value={values.description as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
        />
        <TextInput
          title={'FTP / Supplier code'}
          name={'supplierCode'}
          value={values.supplierCode as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <CheckBox
          title={'Temporal'}
          name={'temporal'}
          value={values.temporal as boolean}
          valueChanged={bool => handleValueChange('temporal', bool)}
          readonly={!!currentRasterSource}
        />
        <DurationField
          title={'Interval'}
          name={'interval'}
          value={values.interval as string}
          valueChanged={value => handleValueChange('interval', value)}
          validated={true}
          readOnly={!!currentRasterSource || values.temporal === false}
        />
        <UploadRasterData
          title={'Data'}
          name={'data'}
          temporal={values.temporal as boolean}
          data={values.data as AcceptedFile[]}
          setData={data => handleValueChange('data', data)}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <AccessModifier
          title={'Access Modifier'}
          name={'accessModifier'}
          value={values.accessModifier as string}
          valueChanged={value => handleValueChange('accessModifier', value)}
        />
        <SelectBox
          title={'Organisation'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={values.organisation as string}
          valueChanged={value => handleValueChange('organisation', value)}
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
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/data_management/rasters/sources'}
          />
          <SubmitButton
            onClick={tryToSubmitForm}
          />
        </div>
      </form>
      {rasterCreatedModal ? (
        <ConfirmModal
          title={'Raster created'}
          buttonName={'Continue'}
          onClick={() => props.history.push('/data_management/raster_layers/new')}
        >
          <p>A layer is needed to view the raster in the portal.</p>
          <p>We automatically created a layer for you to compose. You will now be redirected to the layer management.</p>
        </ConfirmModal>
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  updateRasterSourceUUID: (uuid: string) => dispatch(updateRasterSourceUUID(uuid)),
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
  addFilesToQueue: (files: File[]) => dispatch(addFilesToQueue(files)),
});

export default connect(null, mapPropsToDispatch)(withRouter(RasterSourceForm));